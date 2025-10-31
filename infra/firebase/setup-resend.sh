#!/bin/bash
set -e

echo "================================================"
echo "Resend Email Configuration Setup"
echo "================================================"
echo ""

# Check if user is in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: Please run this script from the firebase directory"
    echo "   cd infra/firebase && ./setup-resend.sh"
    exit 1
fi

echo "This script will help you configure Resend for email verification."
echo ""
echo "Prerequisites:"
echo "1. Resend account (https://resend.com - FREE 3,000 emails/month)"
echo "2. Resend API key"
echo ""
read -p "Do you have a Resend API key? (y/n): " has_key

if [ "$has_key" != "y" ]; then
    echo ""
    echo "📝 Steps to get your Resend API key:"
    echo "   1. Go to https://resend.com"
    echo "   2. Sign up for a free account"
    echo "   3. Go to API Keys section"
    echo "   4. Click 'Create API Key'"
    echo "   5. Copy the key (starts with 're_')"
    echo ""
    echo "Come back and run this script again when you have your key!"
    exit 0
fi

echo ""
read -p "Enter your Resend API key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ Error: API key cannot be empty"
    exit 1
fi

echo ""
echo "📧 Configuring Firebase Functions..."

# Set the API key
firebase functions:config:set resend.api_key="$api_key" --project jrpm-dev

echo ""
read -p "Do you have a verified domain in Resend? (y/n): " has_domain

if [ "$has_domain" = "y" ]; then
    echo ""
    read -p "Enter your 'from' email address (e.g., noreply@yourdomain.com): " from_email
    
    if [ ! -z "$from_email" ]; then
        firebase functions:config:set from.email="$from_email" --project jrpm-dev
        echo "✅ From email configured: $from_email"
    fi
else
    echo ""
    echo "📌 Note: Using default 'onboarding@resend.dev' for now"
    echo ""
    echo "To use your own domain:"
    echo "   1. Go to Resend dashboard > Domains"
    echo "   2. Add your domain and verify DNS records"
    echo "   3. Run: firebase functions:config:set from.email=\"noreply@yourdomain.com\" --project jrpm-dev"
    echo "   4. Redeploy: firebase deploy --only functions:sendVerificationEmail --project jrpm-dev"
fi

echo ""
echo "✅ Configuration saved!"
echo ""
echo "Next steps:"
echo "1. Build functions: cd functions && pnpm build"
echo "2. Deploy: firebase deploy --only functions:sendVerificationEmail,functions:verifyEmailCode --project jrpm-dev"
echo ""
read -p "Would you like to deploy now? (y/n): " deploy_now

if [ "$deploy_now" = "y" ]; then
    echo ""
    echo "🔨 Building functions..."
    cd functions && pnpm build && cd ..
    
    echo ""
    echo "🚀 Deploying email verification functions..."
    firebase deploy --only functions:sendVerificationEmail,functions:verifyEmailCode --project jrpm-dev
    
    echo ""
    echo "================================================"
    echo "✅ Setup Complete!"
    echo "================================================"
    echo ""
    echo "Your email verification system is now live!"
    echo ""
    echo "Test it by:"
    echo "1. Sign up with a new account"
    echo "2. Check your email for the 6-digit code"
    echo "3. Enter the code to verify"
    echo ""
else
    echo ""
    echo "To deploy later, run:"
    echo "   cd functions && pnpm build && cd .."
    echo "   firebase deploy --only functions:sendVerificationEmail,functions:verifyEmailCode --project jrpm-dev"
fi

echo ""
