
// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// --- App & Middleware Setup ---
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// --- Database Connection ---
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// --- Authentication Middleware ---
const checkAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
};

// --- PUBLIC API ROUTES ---

// Get all active promotions
app.get('/api/promotions', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM promotions WHERE is_active = true ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching promotions:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// --- ADMIN PANEL ROUTES ---

// Login page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// Admin dashboard - list all promotions
app.get('/admin', checkAuth, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM promotions ORDER BY id DESC');
        res.render('admin', { promotions: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching promotions');
    }
});

// Add new promotion
app.post('/admin/add', checkAuth, async (req, res) => {
    const { title, description, image_src } = req.body;
    try {
        await pool.query(
            'INSERT INTO promotions (title, description, image_src) VALUES ($1, $2, $3)',
            [title, description, image_src]
        );
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding promotion');
    }
});

// Show edit form
app.get('/admin/edit/:id', checkAuth, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM promotions WHERE id = $1', [req.params.id]);
        if (rows.length > 0) {
            res.render('edit', { promotion: rows[0] });
        } else {
            res.status(404).send('Promotion not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching promotion');
    }
});

// Update promotion
app.post('/admin/update/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { title, description, image_src, is_active } = req.body;
    // Convert checkbox value to boolean
    const isActiveBool = is_active === 'on';
    try {
        await pool.query(
            'UPDATE promotions SET title = $1, description = $2, image_src = $3, is_active = $4 WHERE id = $5',
            [title, description, image_src, isActiveBool, id]
        );
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating promotion');
    }
});

// Delete promotion
app.post('/admin/delete/:id', checkAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM promotions WHERE id = $1', [req.params.id]);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting promotion');
    }
});


// --- Server Start ---
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Admin panel: http://localhost:${port}/admin`);
    console.log(`Public API: http://localhost:${port}/api/promotions`);
});
