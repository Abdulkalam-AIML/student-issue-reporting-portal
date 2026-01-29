const express = require('express');
const dotenv = require('dotenv'); // Restart trigger

const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const startEscalationCron = require('./utils/escalationCron');
const seedData = require('./utils/seeder');

const { loadData, saveData } = require('./utils/persistence');

// Load env vars
dotenv.config();

// Connect to Database
connectDB().then(async () => {
    // Attempt to restore data from disk (SKIP ON VERCEL)
    if (!process.env.VERCEL) {
        const restored = await loadData();

        // Only seed if NO data was restored AND DB is empty
        if (!restored) {
            console.log('No backup found, running seeder...');
            await seedData();
        } else {
            console.log('Data restored from backup. Skipping seed.');
        }
    } else {
        // On Vercel, just connect. 
        // NOTE: In a real app, you would verify if DB is empty and seed once, 
        // but here we simply rely on what's in MongoDB Atlas.
        console.log('Running on Vercel: Skipping local file restore.');
    }

    // AUTOSAVE: Persist data every 5 seconds
    setInterval(async () => {
        await saveData();
    }, 5000);
});
// Start Cron Job
startEscalationCron();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;
