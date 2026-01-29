const User = require('../models/User');
const Issue = require('../models/Issue');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        // Check if data already exists
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Data already seeded (or users exist). Skipping seed.');
            return;
        }

        console.log('Seeding Data for Verification...');

        // 1. Create Users
        // ONLY Admin as requested
        const admin = await User.create({
            name: 'Hackathon Admin',
            email: 'hackthon@gmail.com',
            password: 'fortex', // Plain text, let model hash it
            role: 'admin',
            department: 'Administration'
        });

        console.log('Seed Complete: Admin User Created (All other data wiped)');

    } catch (error) {
        console.error('Seeding Failed:', error);
    }
};

module.exports = seedData;
