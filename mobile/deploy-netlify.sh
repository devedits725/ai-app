#!/bin/bash

# Student Toolkit - Netlify Deployment Script

echo "🚀 Deploying Student Toolkit to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Build the web version
echo "📦 Building web version..."
npx expo export

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Deployment complete!"
echo "📱 Your app is now live on Netlify!"
