// const User = require('../models/User'); // Assuming you have a User model
// const Wallet = require('../models/Wallet'); // Assuming you have a Wallet model

// // Get user profile
// const getUserProfile = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you have user ID in the request (e.g., from a middleware)
//     const user = await User.findById(userId).select('-password'); // Exclude password field
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Recharge wallet
// const rechargeWallet = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you have user ID in the request (e.g., from a middleware)
//     const { amount } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: 'Invalid amount' });
//     }

//     const wallet = await Wallet.findOne({ user: userId });
//     if (!wallet) {
//       return res.status(404).json({ message: 'Wallet not found' });
//     }

//     wallet.balance += amount;
//     await wallet.save();

//     res.json({ message: 'Wallet recharged successfully', balance: wallet.balance });
//   } catch (error) {
//     console.error('Error recharging wallet:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Withdraw from wallet
// const withdrawWallet = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you have user ID in the request (e.g., from a middleware)
//     const { amount } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: 'Invalid amount' });
//     }

//     const wallet = await Wallet.findOne({ user: userId });
//     if (!wallet) {
//       return res.status(404).json({ message: 'Wallet not found' });
//     }

//     if (wallet.balance < amount) {
//       return res.status(400).json({ message: 'Insufficient balance' });
//     }

//     wallet.balance -= amount;
//     await wallet.save();

//     res.json({ message: 'Withdrawal successful', balance: wallet.balance });
//   } catch (error) {
//     console.error('Error withdrawing from wallet:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getUserProfile,
//   rechargeWallet,
//   withdrawWallet,
// };
