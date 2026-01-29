const mongoose = require('mongoose');

const issueSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['hostel', 'transport', 'academic', 'infrastructure', 'safety'],
            required: true,
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low',
        },
        status: {
            type: String,
            enum: ['pending-review', 'open', 'in-progress', 'resolved', 'escalated', 'reopened', 'closed'],
            default: 'pending-review',
        },
        resolutionImage: {
            type: String, // Path or URL to proof
        },
        resolutionNote: {
            type: String,
        },
        resolutionVerified: {
            type: Boolean,
            default: false,
        },
        assignedChain: [{ // Track the chain of command
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        currentHandler: { // The person currently responsible for action
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        initialAuthority: { // The first authority assigned automatically
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        department: {
            type: String,
            required: true,
        },
        escalationLevel: {
            type: Number,
            default: 0, // 0: None, 1: HOD, 2: Dean, 3: Principal
        },
        reopenCount: {
            type: Number,
            default: 0,
        },
        slaDeadline: { // The exact time by which this issue MUST be resolved
            type: Date,
        },
        forwardedHistory: [
            {
                fromUser: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                toUser: { // Can be a specific user or a Role string if generic
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                note: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],
        updateLogs: [
            {
                status: String,
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
