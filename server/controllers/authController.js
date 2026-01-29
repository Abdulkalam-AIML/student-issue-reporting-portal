const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // --- HARDCODED ADMIN LOGIN (HACKATHON DEMO) ---
    if (email === 'hackathon@gmail.com' && password === 'Fortex') {
        let adminUser = await User.findOne({ email: 'hackathon@gmail.com' });

        if (!adminUser) {
            // Create the admin user on the fly if not exists
            adminUser = await User.create({
                name: 'Hackathon Admin',
                email: 'hackathon@gmail.com',
                password: 'Fortex_Auto_Generated_Hash', // Placeholder, won't need to match real hash since we bypass
                role: 'admin',
                department: 'Administration',
            });
        }

        // Force update role if it exists but isn't admin
        if (adminUser.role !== 'admin') {
            adminUser.role = 'admin';
            await adminUser.save();
        }

        res.json({
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: 'admin',
            department: adminUser.department,
            token: generateToken(adminUser._id),
        });
        return;
    }
    // ---------------------------------------------

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            accountabilityScore: user.accountabilityScore,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin only depending on requirements, kept public for dev)
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, studentType, department, year } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Validation for student
    if (role === 'student' && !studentType) {
        res.status(400);
        throw new Error('Student type is required for students');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        studentType,
        department,
        year,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const Issue = require('../models/Issue');

// @desc    Get all data (Users & Issues) for Admin View
// @route   GET /api/auth/admin-data
// @access  Public (for dev speed)
const getAdminData = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    const issues = await Issue.find({});

    res.json({
        users,
        issues,
    });
});

module.exports = { loginUser, registerUser, getAdminData };
