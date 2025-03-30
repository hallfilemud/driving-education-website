#!/bin/bash

# Install dependencies including dev dependencies
npm install --include=dev

# Build the client
echo "Building client-side application..."
npx vite build

# Make sure dist directory exists
mkdir -p dist

# Copy static assets from dist to a public folder in our server directory
echo "Copying static assets..."
mkdir -p dist/public
cp -r dist/*.* dist/public/
cp -r dist/assets dist/public/

# Create a completely standalone production server
echo "Creating production server..."
cat > dist/server.js << 'EOL'
import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// API routes - minimal set for production
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// List out files in the public directory for debugging
console.log("Contents of public directory:");
const publicPath = path.resolve(__dirname, "public");
try {
  if (fs.existsSync(publicPath)) {
    fs.readdirSync(publicPath).forEach(file => {
      console.log(file);
    });
  } else {
    console.log("Public directory doesn't exist");
  }
} catch (err) {
  console.error("Error listing directory:", err);
}

// Serve static files
app.use(express.static(publicPath));

// Fall through to index.html for SPA routing
app.use("*", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error("Error: index.html not found at path:", indexPath);
    res.status(404).send("index.html not found. Public path: " + publicPath);
  }
});

// Start the server
const port = process.env.PORT || 5000;
createServer(app).listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
EOL

# Create a minimal production package.json
echo "Creating production package.json..."
cat > dist/package.json << 'EOL'
{
  "name": "driving-education-site",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.21.2"
  },
  "engines": {
    "node": ">=16"
  }
}
EOL

# Create a startup script first, before changing directories
echo "Creating startup script..."
cat > dist/index.js << 'EOL'
import "./server.js";
EOL

# Install only express in the dist folder
echo "Installing production dependencies..."
cd dist && npm install

# This script is only for building - Render will use the start command separately