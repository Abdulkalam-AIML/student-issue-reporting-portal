const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { calculateSLA } = require('../utils/slaUtil');
const { updateScore } = require('../utils/accountabilityUtil');

// Helper to find initial authority based on category
const findInitialAuthority = async (category, department) => {
    let roleToSearch = 'admin'; // Default fallback
    let deptToSearch = department;

    switch (category) {
        case 'hostel':
            roleToSearch = 'warden';
            break;
        case 'transport':
            roleToSearch = 'transport_incharge';
            break;
        case 'academic':
            roleToSearch = 'faculty'; // Assign to a faculty of the same dept
            break;
        case 'infrastructure':
            roleToSearch = 'admin';
            break;
        case 'safety':
            roleToSearch = 'admin'; // Discipline committee (mapped to admin for now)
            break;
        default:
            roleToSearch = 'admin';
    }

    // Find a user with this role (and department if applicable)
    // For simplicity, find the FIRST match. In prod, logic would be round-robin or specific assignment.
    let query = { role: roleToSearch };
    if (category === 'academic') {
        query.department = deptToSearch;
    }

    const authority = await User.findOne(query);
    return authority ? authority._id : null; // Return ID or null if not found
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private (Student only)
const createIssue = asyncHandler(async (req, res) => {
    const { title, description, category, severity = 'low' } = req.body;

    if (!title || !description || !category) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // --- AI / SMART FEATURE: KEYWORD DETECTION ---
    const urgentKeywords = ['fire', 'fight', 'blood', 'accident', 'suicide', 'harassment', 'ragging', 'collapse', 'spark', 'short circuit'];
    const lowerDesc = description.toLowerCase();
    const isUrgent = urgentKeywords.some(keyword => lowerDesc.includes(keyword));

    if (isUrgent) {
        severity = 'emergency'; // Auto-escalate priority
    }
    // ---------------------------------------------

    // NEW LOGIC: Step 1 - Always goes to Principal (or Admin if no Principal) for Triage
    // Find a Principal
    let triageUser = await User.findOne({ role: 'principal' });
    if (!triageUser) {
        // Fallback to Admin if no Principal exists
        triageUser = await User.findOne({ role: 'admin' });
    }

    // Default to the first found authority or null (admin dashboard handles unassigned)
    const initialAuthorityId = triageUser ? triageUser._id : null;

    // Calculate SLA Deadline
    const slaDeadline = calculateSLA(severity);

    const issue = await Issue.create({
        title,
        description,
        category,
        severity,
        createdBy: req.user._id,
        department: req.user.department,
        initialAuthority: initialAuthorityId,
        currentHandler: initialAuthorityId,
        assignedTo: initialAuthorityId,
        status: 'pending-review', // Force "Pending Review"
        assignedChain: initialAuthorityId ? [initialAuthorityId] : [],
        slaDeadline: slaDeadline // Set the deadline
    });

    res.status(201).json(issue);
});

// @desc    Get all issues (Role based access)
// @route   GET /api/issues
// @access  Private
const getIssues = asyncHandler(async (req, res) => {
    let issues;
    const { role, department, _id } = req.user;

    if (role === 'student') {
        issues = await Issue.find({ createdBy: _id }).sort({ createdAt: -1 });
    } else if (['faculty', 'hod', 'dean', 'principal', 'admin', 'warden', 'transport_incharge'].includes(role)) {

        let query = {
            $or: [
                { currentHandler: _id }, // Assigned to me
                { assignedTo: _id }      // Backward compat
            ]
        };

        // NEW LOGIC: Admin sees ALL issues
        if (role === 'admin') {
            query = {};
        }
        // Principal sees "Pending Review" issues regardless of assignment (Triage Queue)
        else if (role === 'principal') {
            const pendingQuery = { status: 'pending-review' };
            // Merge queries: See generic triage stuff OR things explicitly assigned to me
            query = { $or: [...query.$or, pendingQuery] };
        }

        // HODs/Deans also want to see everything in their dept/college for oversight
        if (role === 'hod') {
            // See my assignments OR things in my dept
            query = { $or: [...query.$or, { department: department }] };
        }

        // Dean sees everything in Academic domain roughly, or just dept? 
        // For simplicity, Dean sees all 'academic' issues or dept issues.
        // Let's keep it simple: Dean sees assigned + dept or all if needed.

        issues = await Issue.find(query)
            .populate('createdBy', 'name')
            .populate('currentHandler', 'name role')
            .populate('assignedTo', 'name role')
            .sort({ createdAt: -1 });
    } else {
        issues = [];
    }

    res.json(issues);
});

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('currentHandler', 'name email role')
        .populate('forwardedHistory.fromUser', 'name role')
        .populate('forwardedHistory.toUser', 'name role')
        .populate('assignedChain', 'name role');

    if (issue) {
        res.json(issue);
    } else {
        res.status(404);
        throw new Error('Issue not found');
    }
});

// @desc    Update issue status or Forward
// @route   PUT /api/issues/:id/status
// @access  Private (Authority only)
const updateIssueStatus = asyncHandler(async (req, res) => {
    const { status, note, forwardToUserId, resolutionImage } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
        res.status(404);
        throw new Error('Issue not found');
    }

    if (req.user.role === 'student') {
        // ALLOW CLOSURE EXCEPTION:
        // Student can only set status to 'closed' AND only if it is currently 'resolved'
        // AND it is their own issue.
        const isOwnIssue = issue.createdBy.toString() === req.user._id.toString();
        const isClosure = status === 'closed';
        const isResolved = issue.status === 'resolved';

        if (isOwnIssue && isClosure && isResolved) {
            // Allowed to proceed to update status
        } else {
            res.status(403);
            throw new Error('Students cannot update issue status, except to close resolved issues.');
        }
    }

    // Logic: If forwardToUserId is present, it's a FORWARD action
    if (forwardToUserId) {
        const nextHandler = await User.findById(forwardToUserId);
        if (!nextHandler) {
            res.status(404);
            throw new Error('User to forward to not found');
        }

        issue.forwardedHistory.push({
            fromUser: req.user._id,
            toUser: nextHandler._id,
            note: note || 'Forwarded',
            timestamp: Date.now()
        });

        issue.currentHandler = nextHandler._id;
        issue.assignedTo = nextHandler._id;
        issue.assignedChain.push(nextHandler._id); // Add to chain

        // If it was Pending Review, now it's Open/In-Progress because someone took action
        if (issue.status === 'pending-review') {
            issue.status = 'open';
        }

        issue.updateLogs.push({
            status: `Forwarded to ${nextHandler.role} (${nextHandler.name})`,
            updatedBy: req.user._id,
            updatedAt: Date.now(),
        });
    }
    // Otherwise it's a STATUS update (Resolve, etc.)
    else if (status) {
        // RESOLUTION CHECK
        if (status === 'resolved') {
            if (!resolutionImage || !note) {
                res.status(400);
                throw new Error('Cannot resolve without Proof Image and Note.');
            }
            issue.resolutionImage = resolutionImage;
            issue.resolutionNote = note;
            issue.resolutionVerified = true;

            // CHECK SLA
            if (issue.slaDeadline && new Date() <= issue.slaDeadline) {
                // Resolved ON TIME -> Increase Score
                await updateScore(req.user._id, 'RESOLVED_ON_TIME');
            }
        }

        issue.status = status;
        issue.updateLogs.push({
            status,
            updatedBy: req.user._id,
            updatedAt: Date.now(),
        });
    }

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
});

// @desc    Get potential users to forward to (for frontend dropdown)
// @route   GET /api/users/forward-candidates
// @access  Private
const getForwardCandidates = asyncHandler(async (req, res) => {
    let rolesToFind = ['faculty', 'hod', 'dean', 'principal', 'admin', 'warden', 'transport_incharge'];

    // STRICT RULE: Faculty can ONLY assign to Warden and Transport Incharge
    if (req.user.role === 'faculty') {
        rolesToFind = ['warden', 'transport_incharge'];
    }

    const users = await User.find({
        role: { $in: rolesToFind },
        _id: { $ne: req.user._id }
    }).select('name role department');
    res.json(users);
});

module.exports = { createIssue, getIssues, getIssueById, updateIssueStatus, getForwardCandidates };
