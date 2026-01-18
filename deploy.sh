#!/bin/bash

# IGNIS Vercel Deployment Script
# Checks build and deploys to Vercel

echo "🚀 IGNIS Deployment Script"
echo "=========================="
echo ""

# Step 1: Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo "📦 Install with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Step 2: Run build test
echo "🔨 Testing production build..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    echo "Fix build errors before deploying"
    exit 1
fi
echo ""

# Step 3: Check environment variables
echo "🔑 Checking environment variables..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local found"
    
    if grep -q "OPENAI_API_KEY" .env.local; then
        echo "  ✅ OPENAI_API_KEY configured"
    else
        echo "  ⚠️  OPENAI_API_KEY not found (will use rule-based fallback)"
    fi
    
    if grep -q "NEXT_PUBLIC_VAPI_PUBLIC_KEY" .env.local; then
        echo "  ✅ NEXT_PUBLIC_VAPI_PUBLIC_KEY configured"
    else
        echo "  ⚠️  NEXT_PUBLIC_VAPI_PUBLIC_KEY not found (demo mode only)"
    fi
else
    echo "⚠️  .env.local not found (demo mode will work)"
fi
echo ""

# Step 4: Deployment choice
echo "📋 Deployment Options:"
echo "  1) Preview deployment (test before production)"
echo "  2) Production deployment"
echo "  3) Cancel"
echo ""
read -p "Select option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Deploying to preview..."
        vercel
        ;;
    2)
        echo ""
        echo "🚀 Deploying to production..."
        echo "⚠️  This will update your live site!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            vercel --prod
        else
            echo "❌ Deployment cancelled"
            exit 0
        fi
        ;;
    3)
        echo "❌ Deployment cancelled"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Visit your deployment URL"
echo "  2. Test landing page (/landing)"
echo "  3. Test demo mode (/)"
echo "  4. Check Vercel logs for any errors"
echo ""
echo "📚 Need help? Check VERCEL_DEPLOYMENT_AUDIT.md"
