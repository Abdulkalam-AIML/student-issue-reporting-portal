const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createUsers = async () => {
    try {
        await User.deleteMany({ email: { $in: ['principal@srm.edu', 'dean@srm.edu', 'faculty@srm.edu'] } });

        const users = [
            { name: 'Dr. Principal', email: 'principal@srm.edu', password: 'password123', role: 'principal', department: 'Other' },
            { name: 'Dr. Dean', email: 'dean@srm.edu', password: 'password123', role: 'dean', department: 'CSE' },
            { name: 'Prof. Faculty', email: 'faculty@srm.edu', password: 'password123', role: 'faculty', department: 'CSE' }
        ];

        for (const u of users) {
            await User.create(u);
            console.log(`Created ${u.role}: ${u.email}`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createUsers();
