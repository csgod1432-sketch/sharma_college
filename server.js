const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Databases (In-memory arrays)
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