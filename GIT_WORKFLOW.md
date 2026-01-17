# Git Workflow Guide - IGNIS

## ✅ SSH Configuration Complete

Your repository is now configured to use SSH for all git operations:
- **Remote URL**: `git@github.com:Aniridh/CruzHacks-Jan16-18.git`
- **SSH Authentication**: Already configured (tested successfully)

## 📝 Quick Commands

### Commit Changes
```bash
./commit.sh "Your descriptive commit message"
```

### Push to Remote
```bash
./push.sh
```

### Commit and Push in One Step
```bash
./commit-and-push.sh "Your descriptive commit message"
```

## 📋 Examples

```bash
# Example 1: Commit new feature
./commit.sh "Add confidence summary panel to SituationReport"

# Example 2: Commit bug fix
./commit.sh "Fix OpenAI API initialization for build"

# Example 3: Commit and push immediately
./commit-and-push.sh "Organize files into Front-End and Back-End folders"

# Example 4: Just push existing commits
./push.sh
```

## 🔧 How It Works

1. **`commit.sh`** - Stages all changes (`git add -A`) and commits with your message
2. **`push.sh`** - Pushes commits to `origin main` via SSH
3. **`commit-and-push.sh`** - Does both in one command

All scripts provide clear feedback with ✅ success and ❌ error messages.

## 🚨 Important Notes

- **Always provide a commit message** - The scripts will fail without one
- **SSH keys required** - Make sure your SSH keys are added to GitHub
- **Pushes go to `main` branch** - The scripts use `git push origin main`

## 📂 Current Status

To see what files need to be committed:
```bash
git status
```

To see what's staged:
```bash
git status --short
```

## 🔄 Alternative: Manual Git Commands

If you prefer using git directly:

```bash
# Stage all changes
git add -A

# Commit with message
git commit -m "Your message here"

# Push via SSH (automatic with current setup)
git push origin main
```

The helper scripts just make this faster and more convenient!
