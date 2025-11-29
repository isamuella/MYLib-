# MYLib - Digital Library Platform

A comprehensive digital library platform providing educational resources, mental health content, and entrepreneurship materials for children in orphanages in Goma, Democratic Republic of Congo.

**Live Demo:** https://mylib-frontend.netlify.app/

## Features

- 📚 **Digital Library**: Browse, search, and download educational books
- 🧠 **Mental Health Resources**: Breathing exercises and wellness activities  
- 💼 **Entrepreneurship Content**: Business lessons and case studies
- 👥 **User Management**: Role-based access (Admin, Teacher, Student)
- 📱 **Offline Support**: Download books for offline reading
- 🔐 **Secure Authentication**: JWT-based authentication system

---

## Complete Setup Guide

Follow these steps exactly to get the project running on your local machine.

### Prerequisites

Before starting, make sure you have these installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
3. **Git** - [Download here](https://git-scm.com/downloads)

### Step 1: Clone the Repository

```bash
git clone https://github.com/isamuella/MYLib-.git
cd MYLib-
```

### Step 2: Set Up MySQL Database

1. **Open MySQL** and create a database:
```sql
CREATE DATABASE MYLib_project;
```

2. **Note your MySQL credentials:**
   - Host: `localhost`
   - Port: `3306`
   - User: `root` (or your MySQL username)
   - Password: Your MySQL password

### Step 3: Configure Backend Environment

1. **Navigate to server folder:**
```bash
cd server
```

2. **Create a `.env` file** in the `server` folder with this content:
```env
PORT=5000
JWT_SECRET=samuella_secret_key@1218
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=MYLib_project
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL password.

3. **Install backend dependencies:**
```bash
npm install
```

4. **Seed the database** with sample data:
```bash
node scripts/seed.js
```

You should see: `Database initialized successfully` and `Seed: demo data inserted`

### Step 4: Configure Frontend Environment

1. **Navigate to client folder:**
```bash
cd ../client
```

2. **Install frontend dependencies:**
```bash
npm install
```

### Step 5: Run the Application

#### Option A: Run Both Frontend and Backend Together (Recommended)

From the **root project folder**:
```bash
cd ..
npm install
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

#### Option B: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 6: Access the Application

Open your browser and go to: **http://localhost:3000**

### Step 7: Login Credentials

The seed script creates these default accounts:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Teacher Account:**
- Username: `teacher1`
- Password: `teacher123`

**Note:** Students can browse without logging in. Login is only for teachers and admins.

---

## Project Structure

```
MYLib-Project/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   └── config.js      # API configuration
│   └── package.json
│
├── server/                # Node.js backend
│   ├── db/               # Database configuration
│   ├── middleware/       # Auth middleware
│   ├── routes/           # API routes
│   ├── scripts/          # Database seed scripts
│   ├── uploads/          # Uploaded files
│   └── package.json
│
└── package.json          # Root package file
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user

### Books
- `GET /api/books` - Get all books (with optional filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Upload new book (Admin/Teacher only)
- `POST /api/books/:id/download` - Track book download

### Mental Health
- `GET /api/mental-health` - Get all mental health resources
- `GET /api/mental-health/:id` - Get single resource

### Entrepreneurship
- `GET /api/entrepreneurship` - Get all entrepreneurship content
- `GET /api/entrepreneurship/:id` - Get single content

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:** 
1. Make sure MySQL is running
2. Check your `.env` credentials are correct
3. Verify the database `MYLib_project` exists

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Or on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install
```

### Issue: Books not loading

**Solution:**
1. Make sure backend is running on port 5000
2. Check `client/src/config.js` has correct API URL
3. Verify database was seeded: `cd server && node scripts/seed.js`

---

## Deployment

### Production URLs

- **Frontend:** https://mylib-frontend.netlify.app/
- **Backend:** https://mylib-backend1.onrender.com/api
- **Database:** Railway MySQL

### Deploy Your Own Instance

#### Frontend (Netlify)
1. Connect your GitHub repo to Netlify
2. Set build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

#### Backend (Render)
1. Create new Web Service on Render
2. Connect your GitHub repo
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && node index.js`
5. Add environment variables from `.env`
6. Deploy

#### Database (Railway)
1. Create MySQL database on Railway
2. Note the connection details
3. Update backend `.env` with Railway credentials
4. Run seed script with Railway credentials

---

## Technologies Used

### Frontend
- React 18
- React Router v6
- Axios
- React PDF
- React Icons

### Backend
- Node.js
- Express.js
- MySQL 2
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

---

## Contributing

This project was developed by **Ineza Samuella** from African Leadership University as part of a capstone project to provide educational resources to children in the Democratic Republic of Congo.

---

## License

MIT License

---

## Acknowledgments

Special thanks to African Leadership University and all contributors who made this project possible.
