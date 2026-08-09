const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Admin Authentication Session Setup
app.use(session({
    secret: 'stockboom_secret_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Protect /admin.html route
app.get('/admin.html', (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login.html');
    }
});

// Admin Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Hardcoded simple authentication for demonstration
    if (username === 'admin' && password === 'stockboom2026') {
        req.session.isAuthenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// API endpoint to GET content
app.get('/api/content', (req, res) => {
    fs.readFile(path.join(__dirname, 'content.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read content.' });
        }
        res.json(JSON.parse(data));
    });
});

// API endpoint to POST (save) content
app.post('/api/content', (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }
    const newContent = req.body;
    fs.writeFile(path.join(__dirname, 'content.json'), JSON.stringify(newContent, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not save content.' });
        }
        res.json({ success: true, message: 'Content saved successfully.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
