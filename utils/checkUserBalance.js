const User = require('../models/User');

const checkUserBalance = async (userId, entryFee) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.depositWallet >= entryFee;
};

module.exports = checkUserBalance;