const User = require('../models/User');

// Update authority score
const updateScore = async (userId, type) => {
    if (!userId) return;

    try {
        const user = await User.findById(userId);
        if (!user) return;

        let change = 0;
        if (type === 'SLA_BREACH') {
            change = -5; // Penalize for missing deadline
        } else if (type === 'ESCALATED_FROM') {
            change = -7; // Penalty for escalation
        } else if (type === 'RESOLVED_ON_TIME') {
            change = 4; // Reward
        } else if (type === 'REOPENED') {
            change = -3; // Penalty if student rejects resolution
        }

        const newScore = user.accountabilityScore + change;
        // Clamp between 0 and 100
        user.accountabilityScore = Math.max(0, Math.min(100, newScore));

        await user.save();
        console.log(`Updated score for ${user.name}: ${user.accountabilityScore} (${change > 0 ? '+' : ''}${change})`);
    } catch (error) {
        console.error('Error updating accountability score:', error);
    }
};

module.exports = { updateScore };
