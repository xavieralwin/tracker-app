---
description: Deploy Tracker App to Ubuntu Server
---

### Prerequisites
- SSH access to Ubuntu server
- Node.js (v18+) and npm installed on server
- PM2 installed globally (`npm install -g pm2`)

### Steps

1. **SSH into the server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Clone the repository**
   ```bash
   mkdir -p ~/apps
   cd ~/apps
   git clone <your-repo-url> tracker-app
   cd tracker-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file and add:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="generate-a-random-secret"
   NODE_ENV="production"
   ```

5. **Database Setup**
   ```bash
   npx prisma db push
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

7. **Start with PM2**
   ```bash
   pm2 start npm --name "tracker-app" -- start
   ```

8. **Enable Persistence**
   ```bash
   pm2 save
   pm2 startup
   ```
