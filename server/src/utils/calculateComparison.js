const calculateComparison = (current, previous) => {

    if (previous === 0) {

        if (current > 0) {
            return {
                percentChange: '100.0', 
                trend: 'up',
            };
        }
        return {
            percentChange: '0.0',
            trend: 'none',
        };
    }
    const percentChange = (((current - previous) / previous) * 100).toFixed(1);
    const trend = percentChange >= 0 ? 'up' : 'down';
    return { percentChange, trend };
};

module.exports = calculateComparison;