#!/bin/bash

# Install dependencies
npm install

# Build the client
echo "Building client-side application..."
npx vite build

# Build the server
echo "Building server-side application..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Start the server
echo "Starting server..."
NODE_ENV=production node dist/index.js