#!/bin/bash

# Install dependencies including dev dependencies
npm install --include=dev

# Build the client
echo "Building client-side application..."
npx vite build

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

// API routes - minimal set for production
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// Serve static files
const staticPath = path.resolve(__dirname, "public");
if (!fs.existsSync(staticPath)) {
  throw new Error("Could not find the static files directory");
}

app.use(express.static(staticPath));

// Fall through to index.html for SPA routing
app.use("*", (req, res) => {
  res.sendFile(path.resolve(staticPath, "index.html"));
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
  }
}
EOL

# Install only express in the dist folder
echo "Installing production dependencies..."
cd dist && npm install

# Create a startup script
echo "Creating startup script..."
cat > dist/index.js << 'EOL'
import "./server.js";
EOL

# This script is only for building - Render will use the start command separately