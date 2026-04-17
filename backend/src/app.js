const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const auditRoutes = require('./routes/audit.routes');
const userRoutes = require('./routes/user.routes');
const orgRoutes = require('./routes/org.routes');

const app = express();

// --- Middleware ---
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// --- Base Routes ---
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Multi-Tenant Task API' });
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'Multi-Tenant Task API v1.0',
        endpoints: ['/api/auth', '/api/tasks', '/api/audit-logs', '/api/users', '/api/organizations']
    });
});

// --- Health check ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', orgRoutes);

// --- 404 handler ---
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// --- Global error handler ---
app.use(errorHandler);

module.exports = app;
