# 🚀 MYLib Deployment Guide

This guide walks you through deploying MYLib to make it publicly accessible with a URL.

## Deployment Stack

- **Frontend:** Vercel (free tier)
- **Backend:** Render (free tier)
- **Database:** Railway MySQL (free tier) or Render PostgreSQL

**Total Time:** 1-2 hours  
**Cost:** $0 (all free tiers)

---

## 📋 Pre-Deployment Checklist

### 1. Prepare Your Code

```bash
# Ensure everything is committed
git add .
git commit -m "Prepare for deployment"

# Push to GitHub (must be public repo)
git push origin main
```

### 2. Update Security Settings

**In `server/.env`, generate a secure JWT secret:**

```bash
# Generate a random 32-character string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and update `JWT_SECRET` in your `.env` file.

---

## Part 1: Deploy Database (Railway)

### Step 1: Create Railway Account

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Create MySQL Database

1. Click "Provision MySQL"
2. Wait for deployment (1-2 minutes)
3. Click on the MySQL service
4. Go to "Variables" tab
5. **Copy these values** (you'll need them):
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### Step 3: Seed the Database

**Update your local `server/.env` with Railway credentials:**

```env
DB_HOST=your-railway-host.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=railway-generated-password
DB_NAME=railway
JWT_SECRET=your-generated-secret-here
PORT=5000
```

**Run the seed script locally:**

```bash
cd server
node scripts/seed.js
```

You should see: "Database initialized successfully" and "Seed: demo data inserted"

---

## Part 2: Deploy Backend (Render)

### Step 1: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Configure Backend Service

1. **Connect your GitHub repository**
2. **Configure service:**
   - **Name:** `mylib-backend`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** Free

### Step 3: Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add these:

```
PORT = 5000
DB_HOST = your-railway-host.railway.app
DB_PORT = 3306
DB_USER = root
DB_PASSWORD = your-railway-password
DB_NAME = railway
JWT_SECRET = your-generated-secret
NODE_ENV = production
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Once deployed, **copy your backend URL** (e.g., `https://mylib-backend.onrender.com`)

### Step 5: Test Backend

Visit: `https://your-backend-url.onrender.com/api`

You should see: `{"status":"ok","message":"MYLib API is running"}`

⚠️ **Important:** The first request may take 30-60 seconds as free tier services "wake up" from sleep.

---

## Part 3: Deploy Frontend (Vercel)

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New..." → "Project"

### Step 2: Import Project

1. **Select your GitHub repository**
2. **Configure project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

### Step 3: Add Environment Variable

Click "Environment Variables" and add:

```
VITE_API_URL = https://your-backend-url.onrender.com/api
```

Replace `your-backend-url.onrender.com` with your actual Render backend URL.

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Once deployed, you'll get a URL like: `https://mylib.vercel.app`

### Step 5: Update Backend CORS

**Important:** Update your backend to allow requests from Vercel:

1. Go to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Add new variable:

   ```
   FRONTEND_URL = https://your-vercel-url.vercel.app
   ```

5. Update `server/index.js` CORS configuration:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);
```

6. Commit and push to trigger redeploy

---

## Part 4: Test Your Deployment

### 1. Test Frontend

Visit your Vercel URL: `https://your-app.vercel.app`

**Check:**

- ✅ Home page loads
- ✅ Library page shows books
- ✅ Mental Health page loads
- ✅ Entrepreneurship page loads
- ✅ Login works with credentials (admin/admin123)

### 2. Test Backend API

Visit: `https://your-backend.onrender.com/api/books`

**Should return:** JSON array of books

### 3. Test Book Reading

1. Click on any book in the library
2. Click "Lire" button
3. PDF should load and display

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**

1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure backend URL ends with `/api`
3. Check CORS settings in `server/index.js`
4. Check Render logs for errors

### Issue: "Failed to load PDF"

**Solution:**

1. Ensure backend is serving files with correct CORS headers
2. Check if books exist in database (run seed script)
3. Verify `/uploads` directory exists on backend

### Issue: Render backend is slow/timing out

**Solution:**

- Free tier services sleep after 15 minutes of inactivity
- First request takes 30-60 seconds to "wake up"
- This is normal for free tier
- Consider upgrading to paid tier for production

### Issue: Database connection failed

**Solution:**

1. Verify Railway MySQL is running
2. Check environment variables match Railway credentials
3. Ensure DB_PORT is set to 3306
4. Test connection locally with Railway credentials

---

## 📝 Final Submission Checklist

After successful deployment, prepare your Google Doc with:

### Required Links:

1. ✅ **Live Application URL** (Vercel)

   - Example: `https://mylib.vercel.app`

2. ✅ **GitHub Repository** (must be public)

   - Example: `https://github.com/yourusername/mylib-project`

3. ✅ **SRS Document Link**

   - Google Docs link with "Anyone with link can view" permissions

4. ✅ **Video Presentation Link** (5-10 minutes)
   - YouTube, Loom, or Google Drive
   - Ensure "Anyone with link can view" permissions

### Video Content Checklist:

- ✅ Introduction & problem statement
- ✅ Explanation of the solution
- ✅ Live demo of all features:
  - Browse library
  - Read a book (PDF viewer)
  - View mental health resources
  - View entrepreneurship content
  - Login as admin
  - Upload a book
  - User management
- ✅ Show system design reflected in prototype
- ✅ Conclusion

### Test All Links:

Before submitting, **open an incognito/private window** and verify:

- All links work
- Live app is accessible
- GitHub repo is public and README is complete
- SRS document is viewable
- Video plays without authentication errors

---

## 🎯 Deployment Success Indicators

You've successfully deployed when:

1. ✅ You can access your frontend at a public URL
2. ✅ Books load and display correctly
3. ✅ PDF reading works
4. ✅ Login functionality works
5. ✅ You can share the URL with others and they can access it
6. ✅ Backend API responds to requests
7. ✅ Database queries return data

---

## 💡 Tips for Grading Success

1. **Test before submitting:** Have a friend try accessing your URL
2. **Include credentials in README:** Make it easy for graders to test admin features
3. **Keep it simple:** Don't overcomplicate - functional is better than fancy
4. **Document known issues:** If something doesn't work, mention it in README
5. **Video quality matters:** Ensure audio is clear and demo is smooth

---

## 🆘 Need Help?

Common resources:

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)

**Time Management:**

- Database setup: 15 minutes
- Backend deployment: 30 minutes
- Frontend deployment: 20 minutes
- Testing & troubleshooting: 30-60 minutes
- **Total: 2-3 hours**

Start early to allow time for troubleshooting!

---

## 📞 Support

If you encounter issues during deployment:

1. Check Render/Vercel logs
2. Test locally first
3. Verify all environment variables
4. Check this guide's troubleshooting section

Good luck with your deployment! 🚀
