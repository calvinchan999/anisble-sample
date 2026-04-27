const express = require('express');
const sql     = require('mssql');
const cors    = require('cors');
const os      = require('os');

const app  = express();
const PORT = 3000;

// Allow requests from the frontend
app.use(cors());

// ── SQL Server connection config ────────────────────────────
const dbConfig = {
  server  : process.env.DB_HOST || '127.0.0.1',
  port    : parseInt(process.env.DB_PORT || '1433'),
  user    : process.env.DB_USER || 'appuser',
  password: process.env.DB_PASS || 'P@ssw0rd',
  database: process.env.DB_NAME || 'appdb',
  options : {
    trustServerCertificate: true,   // required for self-signed certs (dev/lab)
    encrypt              : process.env.DB_ENCRYPT === 'true',
  },
};

// Create a connection pool (mssql manages this automatically)
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

poolConnect
  .then(() => console.log('[DB] Connected to SQL Server'))
  .catch(err => console.error('[DB] Connection failed:', err.message));

// ── Routes ──────────────────────────────────────────────────

// GET /api/health  – simple health check (no DB needed)
app.get('/api/health', (req, res) => {
  res.json({
    status  : 'ok',
    host    : os.hostname(),
    message : 'Backend is running',
  });
});

// GET /api/users  – fetch all rows from the users table
app.get('/api/users', async (req, res) => {
  try {
    await poolConnect;   // ensure pool is ready
    const result = await pool.request().query('SELECT id, name, email FROM users ORDER BY id');
    res.json(result.recordset);
  } catch (err) {
    console.error('[DB] Query error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
