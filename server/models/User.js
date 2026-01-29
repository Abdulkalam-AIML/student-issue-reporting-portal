const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['student', 'faculty', 'hod', 'dean', 'principal', 'admin', 'warden', 'transport_incharge'],
            required: true,
            default: 'student',
        },
        studentType: {
            type: String,
            enum: ['hosteller', 'bus', 'own'],
            required: function () {
                return this.role === 'student';
            },
        },
        department: {
            type: String,
            required: function () {
                return this.role !== 'admin';
            },
            enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'AIDS', 'IoT', 'Cyber', 'BBA', 'MBA', 'Other', 'Administrative', 'Administration', 'Academic'], // Expanded departments
        },
        year: {
            type: Number,
            enum: [1, 2, 3, 4],
            required: function () {
                return this.role === 'student';
            },
        },
        accountabilityScore: { // Performance score for authorities
            type: Number,
            default: 100,
        },
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
