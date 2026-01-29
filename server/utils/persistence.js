const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Issue = require('../models/Issue');

const BACKUP_FILE = path.join(__dirname, '../data/backup.json');

const saveData = async () => {
    try {
        const users = await User.find({});
        const issues = await Issue.find({});

        const data = {
            users,
            issues
        };

        fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2));
        console.log('📦 Data persisted to disk.');
    } catch (error) {
        console.error('Persistence Save Error:', error);
    }
};

const loadData = async () => {
    try {
        if (fs.existsSync(BACKUP_FILE)) {
            const rawData = fs.readFileSync(BACKUP_FILE);
            const data = JSON.parse(rawData);

            // Clear current in-memory data (optional, but good for clean state)
            // await User.deleteMany({});
            // await Issue.deleteMany({});

            // Only insert if empty to prevent duplicates on strict reload, 
            // OR we can use upsert logic. For simplicity, we check counts.
            const userCount = await User.countDocuments();
            if (userCount === 0 && data.users.length > 0) {
                await User.insertMany(data.users);
                console.log(`📦 Restored ${data.users.length} users.`);
            }

            const issueCount = await Issue.countDocuments();
            if (issueCount === 0 && data.issues.length > 0) {
                await Issue.insertMany(data.issues);
                console.log(`📦 Restored ${data.issues.length} issues.`);
            }
            return true; // Data loaded
        }
    } catch (error) {
        console.error('Persistence Load Error:', error);
    }
    return false; // No data loaded
};

module.exports = { saveData, loadData };
