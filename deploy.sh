#!/bin/bash

# Configuration
REPO_URL="https://github.com/xavieralwin/tracker-app.git"
APP_DIR="tracker-app"

echo "🚀 Starting deployment of Tracker App..."

# 1. Detect if we are already in the repo
if [ -f "package.json" ]; then
    echo "📂 Already inside the app directory, pulling latest changes..."
    git pull origin master
else
    # Configuration
    REPO_URL="https://github.com/xavieralwin/tracker-app.git"
    APP_DIR="tracker-app"
    
    if [ -d "$APP_DIR" ]; then
        echo "📂 App directory exists, entering and pulling..."
        cd "$APP_DIR"
        git pull origin master
    else
        echo "📥 Cloning repository..."
        git clone "$REPO_URL" "$APP_DIR"
        cd "$APP_DIR"
    fi
fi

# 2. Install Dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Setup Environment Variables
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat <<EOT >> .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="$(openssl rand -base64 32)"
NODE_ENV="production"
EOT
    echo "✅ .env created with a new random JWT_SECRET."
else
    echo "ℹ️ .env already exists, skipping creation."
fi

# 4. Database Setup
echo "🗄️ Setting up database..."
npx prisma db push

# 5. Build
echo "🏗️ Building application..."
npm run build

# 6. Start with PM2
echo "🏎️ Starting application with PM2..."
pm2 delete tracker-app 2>/dev/null || true
pm2 start npm --name "tracker-app" -- start

echo "💾 Saving PM2 process list..."
pm2 save

echo "🎉 Deployment complete! Visit your server IP/domain to see the app."
