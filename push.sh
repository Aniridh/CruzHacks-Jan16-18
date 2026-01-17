#!/bin/bash

# IGNIS Git Push Helper Script
# Pushes committed changes to remote repository via SSH

echo "📤 Pushing changes to remote repository..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Push successful!"
else
    echo "❌ Push failed. Please check for errors above."
    exit 1
fi
