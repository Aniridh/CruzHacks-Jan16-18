#!/bin/bash

# IGNIS Git Commit Helper Script
# Usage: ./commit.sh "Your commit message"

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a commit message"
    echo "Usage: ./commit.sh \"Your commit message\""
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
    echo "📤 To push to remote, run: git push"
    echo "   Or use: ./push.sh"
else
    echo "❌ Commit failed. Please check for errors above."
    exit 1
fi
