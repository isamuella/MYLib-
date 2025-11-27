# MYLib Setup Guide

## Quick Install

### 1. Install dependencies

```bash
npm run install-all
```

### 2. Start the application

```bash
npm run dev
```

This starts:
- Backend server at http://localhost:5000
- React client at http://localhost:3000

### 3. First login

- Open http://localhost:3000
- Click "Login"
- Use default credentials:
  - Username: `admin`
  - Password: `admin123`

Important: Change the admin password in production.

## Configuration

### Environment variables

Create a `.env` file at the project root using the following template:

```env
REACT_APP_API_URL=http://localhost:5000/api
JWT_SECRET=please_change_this_in_production
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mylib
```

### MySQL database

1. Install MySQL 8+ locally (or point to a remote instance).
2. Create a database/user or ensure your root account can create one:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mylib;"
   ```
3. Seed demo data (creates tables + teacher account):
   ```bash
   npm run seed
   ```

## Usage

### Children (no login)
- Browse the library
- Search, read online, and download books
- Access mental health and entrepreneurship content

### Teachers
1. Log in with a teacher account
2. Open "Upload"
3. Upload books (PDF, EPUB, TXT)
4. Manage educational content

### Administrators
1. Log in with the admin account
2. Open the "Admin Panel"
3. Create users (students, teachers)
4. Manage all content

## Feature Testing

### Test offline mode
1. Download a book
2. Disable internet
3. The downloaded book remains accessible

### Upload a test book
1. Log in as teacher or admin
2. Go to "Upload"
3. Fill the form and select a PDF
4. Click "Upload"

## Troubleshooting

### Server won't start
- Ensure port 5000 is free
- Ensure Node.js is installed (v14+)

### Database connection error
- Ensure MySQL is running and credentials in `.env` are correct
- Verify the user has permission to create databases/tables
- Run `npm run seed` to populate initial data

### Upload issues
- Ensure the `server/uploads/` folders exist
- Check write permissions

## Support

See the main README for more details.

