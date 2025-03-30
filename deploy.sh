#!/bin/bash

# Install dependencies including dev dependencies
npm install --include=dev

# Build the client
echo "Building client-side application..."
npx vite build

# Build the server using our production-specific entry point
echo "Building server-side application..."
npx esbuild server/prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js

# Create a production package.json without devDependencies
echo "Creating production package.json..."
node -e "const pkg = require('./package.json'); delete pkg.devDependencies; require('fs').writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));"

# Clean up node_modules to save space
echo "Cleaning up development dependencies..."
rm -rf node_modules
npm install --production --prefix dist

# This script is only for building - Render will use the start command separately