const mongoose = require('mongoose');
const Issue = require('./models/Issue');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedIssue = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find student and principal
        const student = await User.findOne({ role: 'student' });
        const principal = await User.findOne({ role: 'principal' });

        if (!student || !principal) {
            console.log('Users not found');
            process.exit(1);
        }

        // Create issue
        const issue = await Issue.create({
            title: 'Broken Projector in Lab A',
            description: 'The projector continues to flicker and turn off randomly.',
            category: 'infrastructure',
            severity: 'medium',
            status: 'pending-review',
            createdBy: student._id,
            // Simulate initial routing to principal
            assignedTo: principal._id,
            currentHandler: principal._id,
            assignedChain: [principal._id]
        });

        console.log('Seeded Issue:', issue);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedIssue();
