
// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path module

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

app.set('trust proxy', 1); // Trust the Nginx proxy


// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Files will be stored in public/uploads/
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only SVG and PNG files
    if (file.mimetype === 'image/svg+xml' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only SVG and PNG files are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

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
app.post('/admin/add', checkAuth, upload.single('image'), async (req, res) => {
    const { title_ru, description_ru, title_en, description_en, title_ka, description_ka } = req.body;
    let image_src = req.body.image_src_url; // Use this for URL if no file uploaded

    if (req.file) {
        image_src = '/uploads/' + req.file.filename; // Path to the uploaded file
    }

    try {
        await pool.query(
            'INSERT INTO promotions (title_ru, description_ru, title_en, description_en, title_ka, description_ka, image_src) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [title_ru, description_ru, title_en, description_en, title_ka, description_ka, image_src]
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
app.post('/admin/update/:id', checkAuth, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title_ru, description_ru, title_en, description_en, title_ka, description_ka, is_active } = req.body;
    let image_src = req.body.image_src_url_existing; // Existing URL if no new file uploaded

    if (req.file) {
        image_src = '/uploads/' + req.file.filename; // New uploaded file
    } else if (req.body.image_src_url_new) {
        image_src = req.body.image_src_url_new; // New URL provided
    }

    // Convert checkbox value to boolean
    const isActiveBool = is_active === 'on';
    try {
        await pool.query(
            'UPDATE promotions SET title_ru = $1, description_ru = $2, title_en = $3, description_en = $4, title_ka = $5, description_ka = $6, image_src = $7, is_active = $8 WHERE id = $9',
            [title_ru, description_ru, title_en, description_en, title_ka, description_ka, image_src, isActiveBool, id]
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
        console.log('Attempting to delete promotion with ID:', req.params.id);
        const result = await pool.query('DELETE FROM promotions WHERE id = $1', [req.params.id]);
        console.log('Rows affected by DELETE:', result.rowCount);
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
