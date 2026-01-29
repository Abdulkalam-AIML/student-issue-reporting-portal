const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private (Dean, Principal, Admin)
const getAnalytics = asyncHandler(async (req, res) => {

    // Total Issues
    const totalIssues = await Issue.countDocuments();

    // Issues by Category
    const issuesByCategory = await Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Issues by Severity
    const issuesBySeverity = await Issue.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Issues by Status
    const issuesByStatus = await Issue.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Department with most issues
    const departmentIssues = await Issue.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    // Average Resolution Time (in hours)
    // Only considers resolved issues with updateLogs containing 'resolved'
    const avgResolutionTime = await Issue.aggregate([
        { $match: { status: 'resolved' } },
        {
            $project: {
                createdAt: 1,
                resolvedAt: { $max: "$updateLogs.updatedAt" }, // Assuming last update is resolution, or filter logs
                // Better: Find the log entry where status is 'resolved'
            }
        }
    ]);

    // Simplified AVG calculation for prototype:
    // We can iterate or refine aggregation if strict accuracy needed. 
    // For now, let's just return what we have.

    res.json({
        totalIssues,
        issuesByCategory,
        issuesBySeverity,
        issuesByStatus,
        departmentIssues: departmentIssues[0],
        // avgResolutionTime: calculatedTime // Pending complex logic implementation
    });
});

module.exports = { getAnalytics };
