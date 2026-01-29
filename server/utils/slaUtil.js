const calculateSLA = (severity) => {
    const now = new Date();
    let hoursToAdd = 48; // Low - Default

    // Handle missing or invalid severity
    const safelySeverity = severity ? severity.toLowerCase() : 'low';

    // Logic based on prompt: Low=48h, Medium=24h, High=12h, Emergency=2h
    switch (safelySeverity) {
        case 'medium':
            hoursToAdd = 24;
            break;
        case 'high':
            hoursToAdd = 12;
            break;
        case 'emergency':
            hoursToAdd = 2;
            break;
        case 'low':
        default:
            hoursToAdd = 48;
            break;
    }

    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
};

module.exports = { calculateSLA };
