const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');
const os      = require('os');

const app  = express();
const PORT = 3000;

// Allow requests from the frontend (any origin for demo purposes)
app.use(cors());

// ── MySQL connection ─────────────────────────────────────────
// Values are passed as environment variables by Docker (see site.yml)
const db = mysql.createConnection({
  host     : process.env.DB_HOST || '127.0.0.1',
  user     : process.env.DB_USER || 'appuser',
  password : process.env.DB_PASS || 'apppass',
  database : process.env.DB_NAME || 'appdb',
});

db.connect(err => {
  if (err) console.error('[DB] Connection failed:', err.message);
  else     console.log('[DB] Connected to MySQL');
});

// ── Routes ───────────────────────────────────────────────────

// GET /api/health  – simple health check (no DB needed)
app.get('/api/health', (req, res) => {
  res.json({
    status  : 'ok',
    host    : os.hostname(),
    message : 'Backend is running',
  });
});

// GET /api/users  – fetch all rows from the users table
app.get('/api/users', (req, res) => {
  db.query('SELECT id, name, email FROM users ORDER BY id', (err, rows) => {
    if (err) {
      console.error('[DB] Query error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
