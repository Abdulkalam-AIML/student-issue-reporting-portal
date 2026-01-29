const cron = require('node-cron');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { updateScore } = require('./accountabilityUtil');

const findAuthority = async (role, department) => {
    let query = { role };
    // Department specific roles
    if (['hod', 'faculty', 'dean'].includes(role) && department) {
        query.department = department; // Match department
    }
    // Find first matching authority
    const authority = await User.findOne(query);
    return authority ? authority._id : null;
};

const startEscalationCron = () => {
    // Run every 30 minutes to be responsive (or every hour)
    cron.schedule('*/30 * * * *', async () => {
        console.log('Running Escalation Job...' + new Date().toISOString());

        try {
            const now = new Date();
            // Find unresolved issues that have passed their deadline
            const issues = await Issue.find({
                status: { $nin: ['resolved', 'closed'] },
                slaDeadline: { $lte: now } // Deadline passed
            });

            for (const issue of issues) {
                let nextLevel = issue.escalationLevel + 1;
                let newRole = '';
                let escalatedTo = null;

                // Define Escalation Path
                // Level 0 (Initial) -> Level 1 (HOD/Warden) -> Level 2 (Dean/Admin) -> Level 3 (Principal)

                // Determine next role based on Category & Current Level
                if (nextLevel === 1) {
                    // First Breach
                    if (issue.category === 'academic') newRole = 'hod';
                    else if (issue.category === 'hostel') newRole = 'warden'; // Usually already warden, maybe Chief Warden?
                    else if (issue.category === 'transport') newRole = 'admin'; // Transport Head -> Admin
                    else newRole = 'admin';
                } else if (nextLevel === 2) {
                    // Second Breach
                    if (issue.category === 'academic') newRole = 'dean';
                    else newRole = 'admin';
                } else if (nextLevel >= 3) {
                    // Final Breach
                    newRole = 'principal';
                    nextLevel = 3; // Cap at 3
                }

                // If we are already at max level, just notify principal again or skip
                if (issue.escalationLevel >= 3) {
                    // Already at Principal, maybe just update score again?
                    // Don't loop infinitely updating logs every 30 mins
                    // Just update once per day maybe? 
                    // For demo, let's stop if already at Level 3
                    continue;
                }

                // Find the user for this new role
                escalatedTo = await findAuthority(newRole, issue.department);

                if (!escalatedTo && newRole !== 'principal') {
                    // Fallback to Admin if specific role not found
                    newRole = 'admin';
                    escalatedTo = await findAuthority('admin');
                }

                if (escalatedTo) {
                    // PENALIZE CURRENT HANDLER
                    if (issue.currentHandler) {
                        await updateScore(issue.currentHandler, 'SLA_BREACH');
                        await updateScore(issue.currentHandler, 'ESCALATED_FROM');
                    }

                    // UPDATE ISSUE
                    issue.escalationLevel = nextLevel;
                    issue.status = 'escalated';
                    issue.currentHandler = escalatedTo;
                    issue.assignedTo = escalatedTo; // Legacy sync

                    // Set new deadline (Give 12 hours for escalated issue)
                    issue.slaDeadline = new Date(now.getTime() + 12 * 60 * 60 * 1000);

                    // LOG
                    issue.forwardedHistory.push({
                        fromUser: issue.currentHandler, // Technically system moved it, but 'from' previous
                        toUser: escalatedTo,
                        note: `Auto-Escalation (Level ${nextLevel}) due to SLA Breach`,
                        timestamp: now
                    });

                    issue.updateLogs.push({
                        status: `Escalated to ${newRole} (Level ${nextLevel})`,
                        updatedAt: now,
                        updatedBy: null, // System
                    });

                    await issue.save();
                    console.log(`Issue ${issue._id} Escalated to ${newRole}`);
                } else {
                    console.log(`Could not find authority for ${newRole}`);
                }
            }
        } catch (error) {
            console.error('Escalation Job Error:', error);
        }
    });
};

module.exports = startEscalationCron;
