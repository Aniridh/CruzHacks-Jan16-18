#!/bin/bash

# IGNIS Git Commit and Push Helper Script
# Usage: ./commit-and-push.sh "Your commit message"

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a commit message"
    echo "Usage: ./commit-and-push.sh \"Your commit message\""
    exit 1
fi

COMMIT_MESSAGE="$1"

echo "📝 Staging all changes..."
git add -A

echo "💾 Committing changes with message: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Commit successful!"
    echo ""
    echo "📤 Pushing to remote repository..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Push successful!"
        echo "🎉 All changes have been committed and pushed!"
    else
        echo "❌ Push failed. Commit was successful but push failed."
        exit 1
    fi
else
    echo "❌ Commit failed. Please check for errors above."
    exit 1
fi
