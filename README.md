# MYLib - Digital Library

> A digital library platform providing educational resources, mental health support, and entrepreneurship content for children in orphanages in Goma, Democratic Republic of Congo.

**🌐 Live Demo:** [Add your deployed URL here]  
**📹 Video Demo:** [Add your video link here]  
**📄 SRS Document:** [Add your SRS link here]  
**💻 GitHub:** [Add your repository link here]

---

## 🚀 Quick Links

- **[DEPLOYMENT GUIDE](./DEPLOYMENT.md)** - Step-by-step deployment to Vercel + Render (1-2 hours)
- **[SUBMISSION CHECKLIST](./SUBMISSION_CHECKLIST.md)** - Complete checklist for assignment submission
- **[Quick Start](#quick-start)** - Get started locally in 10 minutes

---

## 📖 Table of Contents

- [Mission](#mission)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Deployment Guide](#deployment-guide)
- [Default Credentials](#default-credentials)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## Mission

Provide education facilities and systems to children in Eastern DRC affected by conflict. MYLib offers access to learning materials, mental health content, and entrepreneurship resources to help children grow into future leaders and innovators.

## Problem Statement

Children in orphanages in Goma, Eastern Democratic Republic of Congo, face significant barriers to accessing quality educational resources due to:

- Limited physical library infrastructure
- Lack of internet connectivity
- Shortage of educational materials
- Need for mental health and entrepreneurship resources

**Why is this a problem?**
Without access to educational resources, children cannot develop the skills needed to become future leaders and break the cycle of poverty. The conflict-affected region requires solutions that work offline and provide holistic development opportunities.

**Our Solution:**
MYLib is a progressive web application that provides:

- Offline-first digital library
- Mental health resources for emotional well-being
- Entrepreneurship content to foster self-reliance
- Role-based access for different user types

## Features

### For Children (no login required)

- Digital Library: Search, read, and download books
- Mental Health: Access exercises and stories
- Entrepreneurship: Books, lessons, and case studies
- Offline Mode: Access downloaded books without internet

### For Teachers (login required)

- Upload books and resources
- Manage educational content

### For Admins (login required)

- Manage users (admin, teacher, student)
- Maintain system and content

## Technology Stack

### Backend

- Node.js + Express
- MySQL database (mysql2)
- JWT authentication
- Multer for file uploads
- Bcrypt for password hashing

### Frontend

- React 18
- React Router
- Axios
- react-pdf for PDF viewing
- Service Worker for offline support

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/downloads)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mylib-project.git
cd mylib-project
```

#### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to project root
cd ..
```

#### 3. Configure MySQL Database

**Start MySQL service:**

```bash
# macOS (using Homebrew)
brew services start mysql

# Windows
# Start MySQL from Services or MySQL Workbench

# Linux
sudo systemctl start mysql
```

**Create the database:**

```bash
mysql -u root -p
```

Then in MySQL shell:

```sql
CREATE DATABASE MYLib_project;
EXIT;
```

#### 4. Configure Environment Variables

**Create `.env` file in the `server` folder:**

```bash
cd server
cp .env.example .env
```

**Edit `server/.env` with your values:**

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=MYLib_project
JWT_SECRET=your_secret_key_minimum_32_characters_here
```

**For the client, create `client/.env`:**

```bash
cd ../client
touch .env
```

**Add to `client/.env`:**

```env
VITE_API_URL=http://localhost:5000/api
```

#### 5. Initialize Database with Sample Data

```bash
# From project root
cd server
node scripts/seed.js
```

This will create:

- Database tables (users, books, mental_health_resources, entrepreneurship_content)
- Default admin user
- Sample books, mental health exercises, and entrepreneurship lessons

#### 6. Start the Application

**Option A: Run both servers simultaneously (from project root):**

```bash
npm run dev
```

**Option B: Run separately:**

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

#### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## Default Credentials

After seeding the database, you can log in with:

### Admin Account

- **Username:** `admin`
- **Password:** `admin123`
- **Permissions:** Full access (user management, content upload, delete)

### Teacher Account

- **Username:** `teacher1`
- **Password:** `teacher123`
- **Permissions:** Upload and manage educational content

### Student Access

- **No login required** for browsing books, mental health resources, and entrepreneurship content

⚠️ **Important:** Change default passwords in production!

## Project Structure

```
MYLib Project/
├── server/                 # Node.js/Express backend
│   ├── db/                # Database (MySQL)
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded files
│   └── index.js           # Server entrypoint
├── client/                 # React frontend
│   ├── public/            # Public assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # App pages
│   │   └── App.js         # App root
│   └── package.json
└── README.md
```

## API Documentation

### Authentication Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Register (Admin only)

```http
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "role": "student" // or "teacher", "admin"
}
```

### Books Endpoints

- `GET /api/books` - List all books (supports ?category=education&search=term)
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Upload book (teacher/admin, multipart/form-data)
- `DELETE /api/books/:id` - Delete book (admin only)
- `POST /api/books/:id/download` - Track download count

### Mental Health Endpoints

- `GET /api/mental-health` - List resources (supports ?type=exercise or ?type=story)
- `GET /api/mental-health/:id` - Get resource details
- `POST /api/mental-health` - Create resource (teacher/admin)
- `DELETE /api/mental-health/:id` - Delete resource (admin only)

### Entrepreneurship Endpoints

- `GET /api/entrepreneurship` - List content (supports ?type=lesson or ?type=case_study)
- `GET /api/entrepreneurship/:id` - Get content details
- `POST /api/entrepreneurship` - Create content (teacher/admin)
- `DELETE /api/entrepreneurship/:id` - Delete content (admin only)

### User Management Endpoints

- `GET /api/users` - List all users (admin only)
- `GET /api/users/me` - Get current user info (authenticated)

## Offline Capabilities

- Service Workers for caching
- LocalStorage for download info
- Downloaded books remain accessible offline (7+ days)

## Constraints

- Lightweight app (<50MB)
- Offline reading supported
- Open-source tools only
- Android + modern browsers supported
- French UI, English documentation
- Supports ~20 concurrent users

## Supported Browsers

- Google Chrome
- Microsoft Edge
- Safari
- Firefox

## Development Process

This project follows Agile methodology with iterative feedback and continuous improvement.

## Testing

- Manual regression steps are documented in `TEST_PLAN.md`
- Offline scenario (download + airplane mode) verified
- Chrome, Edge, and Android Chrome smoke-tested

## License

MIT License

## Author

Ineza Samuella – African Leadership University

## Support

Open an issue in the project repository for questions or support.

---

## Deployment (Beginner-friendly) — Vercel (frontend) + Render or Railway (backend + MySQL)

Goal: make your project publicly accessible with a URL so graders can access the prototype.

Overview:

- Frontend: deploy the `client` folder as a Vite app on Vercel (free, automatic GitHub integration).
- Backend: deploy the `server` folder on Render or Railway (both support Node services). For the database, create a managed MySQL instance (Railway or PlanetScale) and point the backend to it.

Step-by-step (Vercel + Render example)

1. Push your repository to GitHub and make it public.

2. Backend (Render)

- Sign up at https://render.com and connect your GitHub account.
- Create a new Web Service, select your repository and set the Root Directory to `server`.
- Build/Start Command: `npm start` (or `node index.js`).
- Environment:
  - `PORT` = `5000`
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` = values from your managed MySQL
  - `JWT_SECRET` = a secure string
- Database: create a managed MySQL instance on Railway or another provider. When the DB is created, copy the host/user/password and set them in Render's environment settings.
- After deployment, you can run the seed script from the Render dashboard (one-off job) or run the seed script locally pointing to your remote DB:
  ```bash
  # locally, with .env pointing to remote DB
  npm run seed
  ```

3. Frontend (Vercel)

- Sign up at https://vercel.com and connect your GitHub account.
- Import the project and, when configuring, set the Root Directory to `client`.
- Build Command: `npm run build` (Vite) — Vercel will detect Vite automatically for many repos.
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL` = `https://<your-backend-url>/api` (Render will provide a URL for your service)
- Deploy. Vercel will build and publish a public URL (e.g., `https://mylib.vercel.app`).

4. Verify

- Open the frontend URL and verify pages (Library, Mental Health, Entrepreneurship, Login/Upload flow).
- If uploads are used, ensure the backend's `uploads/` path is accessible or configure persistent storage (Render has volumes on paid plans). For the assignment, seed data and simple file usage is usually enough.

Alternative simpler stack (if you want everything in one place):

- Render can host both backend and static frontend. You can deploy the frontend by building locally and pointing Render to the `client/dist` folder or use Render static site options. Railway also supports full-stack deployments.

Notes & tips for the submission

- Make the repo public and add a top-level `SETUP.md` or enhance this `README.md` with every exact command needed to get the app running locally and in production.
- Add a link to your SRS and a link to the recorded video in the Google Doc (per assignment instructions).
- Ensure your README includes the exact live URL and any credentials needed to access admin features (change passwords in production).

Checklist for grading (make these links visible in your Google Doc):

- Live public URL for the app (frontend) — required.
- Public GitHub repo link — required.
- Link to SRS document — required.
- Link to your recorded video in Google Doc (5–10 minutes) — required.

If you want, I can take care of the deploy steps now: I can help create the Render service and Vercel project instructions and guide you through adding environment variables and running the seed. Tell me which provider you prefer for the database (Railway/PlanetScale/Render) and I will produce exact steps and commands.
