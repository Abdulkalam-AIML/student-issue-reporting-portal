const StatusBadge = ({ status }) => {
    let colorClass = 'bg-gray-100 text-gray-800';

    switch (status) {
        case 'open':
            colorClass = 'bg-blue-100 text-blue-800';
            break;
        case 'in-progress':
            colorClass = 'bg-yellow-100 text-yellow-800';
            break;
        case 'resolved':
            colorClass = 'bg-green-100 text-green-800';
            break;
        case 'escalated':
            colorClass = 'bg-red-100 text-red-800';
            break;
        default:
            break;
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
