# ⚡ Quick Deployment Guide (30 minutes)

## If you're short on time, follow this streamlined version:

### 1. Deploy Database (5 minutes)
1. Go to https://railway.app
2. Click "New Project" → "Provision MySQL"
3. Copy credentials from Variables tab

### 2. Seed Database (2 minutes)
```bash
# Update server/.env with Railway credentials
cd server
node scripts/seed.js
```

### 3. Deploy Backend (10 minutes)
1. Go to https://render.com
2. New Web Service → Connect GitHub repo
3. Root Directory: `server`
4. Start Command: `node index.js`
5. Add all environment variables
6. Deploy

### 4. Deploy Frontend (10 minutes)
1. Go to https://vercel.com
2. Import project → Select repo
3. Root Directory: `client`
4. Add env: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### 5. Test (3 minutes)
- Visit Vercel URL
- Try logging in (admin/admin123)
- Read a book
- Done! 🎉

**Full details:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
