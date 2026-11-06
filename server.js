const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PORT = 3000;

// ─────────────────────────────────────────────
// JWT SECRET  (put a real random string in .env)
// ─────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'sharma_erp_secret_2026';

app.use(express.json());
app.use(express.static(__dirname));

// ─────────────────────────────────────────────
// MYSQL CONNECTION POOL
// ─────────────────────────────────────────────
// Edit host / user / password / database to match your MySQL setup.
// If you have not created the DB yet, run the SQL in the comment block below.
/*
  CREATE DATABASE IF NOT EXISTS sharma_erp;
  USE sharma_erp;

  CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      roll_no     VARCHAR(50)  NOT NULL UNIQUE,
      email       VARCHAR(100) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,          -- bcrypt hash
      first_name  VARCHAR(100),
      middle_name VARCHAR(100),
      last_name   VARCHAR(100),
      course      VARCHAR(50),
      year        VARCHAR(20),
      role        ENUM('student','college','admin') DEFAULT 'student',
      photo_url   TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );
*/
const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',       // ← set your MySQL password here
    database: process.env.DB_NAME     || 'sharma_erp',
    waitForConnections: true,
    connectionLimit: 10
});

// Test connection on startup
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('✅ MySQL connected successfully.');
        conn.release();
    } catch (err) {
        console.warn('⚠️  MySQL not available:', err.message);
        console.warn('   Server will still run; MySQL auth routes will return errors.');
    }
})();

// ─────────────────────────────────────────────
// AUTH MIDDLEWARE (optional – protect routes)
// ─────────────────────────────────────────────
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided.' });
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
}

// ─────────────────────────────────────────────
// API: REGISTER  (POST /api/register)
// ─────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
    const { rollNo, email, password, firstName, middleName, lastName, course, year, role } = req.body;

    if (!rollNo || !email || !password) {
        return res.status(400).json({ success: false, message: 'Roll number, email and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    try {
        // Check if roll_no OR email already exists
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE roll_no = ? OR email = ?',
            [rollNo, email.toLowerCase()]
        );
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'An account with this Roll Number or Email already exists.' });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 12);

        // Insert new user
        const [result] = await pool.execute(
            `INSERT INTO users (roll_no, email, password, first_name, middle_name, last_name, course, year, role)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                rollNo,
                email.toLowerCase(),
                hash,
                firstName  || '',
                middleName || '',
                lastName   || '',
                course     || '',
                year       || '',
                role       || 'student'
            ]
        );

        console.log(`\n--- NEW USER REGISTERED ---`);
        console.log(`Roll No: ${rollNo} | Email: ${email} | Role: ${role || 'student'}`);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            userId: result.insertId
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// ─────────────────────────────────────────────
// API: LOGIN  (POST /api/login)
// ─────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        // Fetch user by email
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email.toLowerCase()]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'No account found with that email. Please register first.' });
        }

        const user = rows[0];

        // Verify password against stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
        }

        // Generate JWT token (expires in 8 hours)
        const token = jwt.sign(
            { id: user.id, rollNo: user.roll_no, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        console.log(`\n--- LOGIN SUCCESSFUL ---`);
        console.log(`Email: ${user.email} | Role: ${user.role}`);

        return res.json({
            success: true,
            message: `Welcome back, ${user.first_name || user.email}!`,
            token,
            user: {
                id:         user.id,
                rollNo:     user.roll_no,
                email:      user.email,
                firstName:  user.first_name,
                middleName: user.middle_name,
                lastName:   user.last_name,
                course:     user.course,
                year:       user.year,
                role:       user.role,
                photoURL:   user.photo_url || ''
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

// ─────────────────────────────────────────────
// API: GET CURRENT USER (protected example)
// ─────────────────────────────────────────────
app.get('/api/me', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (!rows.length) return res.status(404).json({ success: false, message: 'User not found.' });
        const u = rows[0];
        res.json({
            success: true,
            user: {
                id: u.id, rollNo: u.roll_no, email: u.email,
                firstName: u.first_name, middleName: u.middle_name, lastName: u.last_name,
                course: u.course, year: u.year, role: u.role, photoURL: u.photo_url || ''
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching profile.' });
    }
});

// In-memory arrays (kept for legacy routes below)
let attendanceLogs = [];
let doubtMessages = [];

// API Route: Attendance Logging (Fallback if Firebase is off)
app.post('/api/attendance', (req, res) => {
    const { studentName, status, timestamp } = req.body;
    
    const newEntry = {
        id: attendanceLogs.length + 1,
        studentName,
        status,
        timestamp
    };

    attendanceLogs.push(newEntry);

    console.log(`\n--- NEW ATTENDANCE RECORDED ---`);
    console.log(`Student: ${newEntry.studentName}`);
    console.log(`Status:  ${newEntry.status}`);
    console.log(`Time:    ${newEntry.timestamp}`);

    res.json({ 
        success: true, 
        message: "Attendance Verified and Logged!" 
    });
});

// API Route: Submit Doubt
app.post('/api/doubts', (req, res) => {
    const { studentName, subject, message } = req.body;
    
    const newDoubt = {
        id: Date.now(),
        studentName: studentName || "Anonymous",
        subject,
        message,
        reply: null,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    doubtMessages.push(newDoubt);
    console.log(`\n--- NEW DOUBT RECEIVED ---`);
    console.log(`Subject: ${subject}`);
    
    res.json({ success: true, message: "Doubt sent securely." });
});

// API Route: Get Doubts (Student checking their doubts)
app.get('/api/doubts', (req, res) => {
    // In a real app we'd filter by studentName
    res.json(doubtMessages);
});

// API Route: Reply to Doubt (Faculty)
app.post('/api/doubts/reply', (req, res) => {
    const { id, reply } = req.body;
    
    const doubt = doubtMessages.find(d => d.id === id);
    if (doubt) {
        doubt.reply = reply;
        console.log(`[Doubt ${id}] Reply Sent: ${reply}`);
        return res.json({ success: true, message: "Reply sent." });
    }
    res.status(404).json({ success: false, message: "Doubt not found." });
});

// API Route: Get Academic Calendar
app.get('/api/calendar', (req, res) => {
    const calendarData = [
        { date: "2026-04-10", title: "Mid-Term Examinations Begin", type: "exam" },
        { date: "2026-04-14", title: "Dr. Ambedkar Jayanti", type: "holiday" },
        { date: "2026-04-20", title: "Annual Tech Fest 'Innovate'", type: "event" },
        { date: "2026-05-01", title: "Maharashtra Day", type: "holiday" },
        { date: "2026-05-15", title: "End-Semester Examinations", type: "exam" },
        { date: "2026-06-01", title: "Summer Vacation Begins", type: "holiday" }
    ];
    res.json(calendarData);
});

app.listen(PORT, () => {
    console.log(`\n✅ Sharma ERP Server is Live!`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`⌨️  Press Ctrl+C to shut down\n`);
});