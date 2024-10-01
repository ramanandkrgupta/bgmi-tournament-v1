import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig'; // Assuming you have axios setup

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/user/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleRecharge = async () => {
    try {
      await axios.post('/wallet/recharge', { amount: rechargeAmount });
      alert('Recharge successful');
    } catch (error) {
      alert('Error during recharge');
    }
  };

  const handleWithdraw = async () => {
    try {
      await axios.post('/wallet/withdraw', { amount: withdrawAmount });
      alert('Withdrawal successful');
    } catch (error) {
      alert('Error during withdrawal');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Profile</h1>
      <div className="bg-[#181818] rounded-lg p-4 mb-4 shadow-md">
        <h2 className="text-white text-2xl font-bold">User Details</h2>
        <p className="text-white">Username: {profile.username}</p>
        <p className="text-white">Email: {profile.email}</p>
        <p className="text-white">Mobile: {profile.mobile}</p>
        <p className="text-white">Matches Played: {profile.matchesPlayed}</p>
        <p className="text-white">Matches Won: {profile.matchesWon}</p>
        <p className="text-white">Referral Code: {profile.referralCode}</p>

        <h2 className="text-white text-2xl font-bold mt-4">Wallet Balances</h2>
        <p className="text-white">Deposit Wallet: {profile.depositWallet} INR</p>
        <p className="text-white">Winning Wallet: {profile.winningsWallet} INR</p>

        <h2 className="text-white text-2xl font-bold mt-4">Recharge Wallet</h2>
        <input 
          type="number" 
          value={rechargeAmount} 
          onChange={(e) => setRechargeAmount(e.target.value)} 
          className="w-full p-3 border rounded-md bg-gray-100"
          placeholder="Enter amount to recharge"
        />
        <button 
          onClick={handleRecharge} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Recharge
        </button>

        <h2 className="text-white text-2xl font-bold mt-4">Withdraw Wallet</h2>
        <input 
          type="number" 
          value={withdrawAmount} 
          onChange={(e) => setWithdrawAmount(e.target.value)} 
          className="w-full p-3 border rounded-md bg-gray-100"
          placeholder="Enter amount to withdraw"
        />
        <button 
          onClick={handleWithdraw} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};




export default Profile;