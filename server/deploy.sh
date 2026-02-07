#!/bin/bash

echo "🚀 Deploying Zenith Server..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Start the server
echo "🎯 Starting server..."
npm start
