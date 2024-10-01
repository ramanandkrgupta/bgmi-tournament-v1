import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  const [activeTab, setActiveTab] = useState('team'); // State to control active tab

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`/tournament/matches/${id}`);
        setMatch(response.data);
       
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [id]);
  

  if (!match) return <div>Loading...</div>;

  const renderMatchCard = () => (
    <div className="bg-[#181818] rounded-lg p-4 mb-4 shadow-md relative">
      <img 
        src={match.bannerImage} 
        alt={`${match.name} Banner`} 
        className="h-48 w-full object-cover rounded-t-lg"
      />
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 rounded-t-lg p-2 flex justify-between items-center">
        <span className="text-white text-sm font-bold">PRIZEPOOL</span>
        <span className="text-yellow-400 text-2xl font-bold">{match.prize} INR</span>
      </div>
      <div className="mt-2">
        <h2 className="text-white text-xl font-bold">{match.name}</h2>
        <p className="text-blue-500 text-lg font-bold">
          <span className="font-semibold text-red-400">Start Date:</span> {new Date(match.startDate).toLocaleDateString()} {new Date(match.startDate).toLocaleTimeString()}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
          <div>
            <span className="text-gray-400 font-semibold">Entry Fee:</span> 
            <span className="text-white ml-2">{match.entryFee} INR</span>
          </div>
          <div>
            <span className="text-gray-400 font-semibold">Map:</span> 
            <span className="text-white ml-2">{match.map}</span>
          </div>
          <div>
            <span className="text-gray-400 font-semibold">Per Kill:</span> 
            <span className="text-white ml-2">{match.perKill} INR</span>
          </div>
          <div>
            <span className="text-gray-400 font-semibold">Mode:</span> 
            <span className="text-white ml-2">{match.mode}</span>
          </div>
          <div>
            <span className="text-gray-400 font-semibold">Joined:</span> 
            <span className="text-white ml-2">{match.teams.length}/{match.maxTeamJoin}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex space-x-4 mb-6">
      <button
        className={`px-4 py-2 rounded ${activeTab === 'team' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => setActiveTab('team')}
      >
        Team
      </button>
      <button
        className={`px-4 py-2 rounded ${activeTab === 'prizepool' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => setActiveTab('prizepool')}
      >
        Prizepool
      </button>
      <button
        className={`px-4 py-2 rounded ${activeTab === 'rule' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}
        onClick={() => setActiveTab('rule')}
      >
        Rule
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Joined Teams</h2>
            <ul>
              {match.teams.map(team => (
                <li key={team._id} className="text-white">
                  {team.name || 0} - Points: {team.pointsEarned || 0}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'prizepool':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Prizepool</h2>
            <ul>
              <li className="text-white">Rank 1: 1000 INR</li>
              <li className="text-white">Rank 2: 500 INR</li>
              <li className="text-white">Rank 3: 200 INR</li>
            </ul>
          </div>
        );
        case 'rule':
          return (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Game Rules</h2>
              <div className="text-white space-y-2">
                <p>1. Solo and duos players will be disqualified from that match.</p>
                <p>2. No kick requests will be taken after 7 minutes of announcing the room ID and password.</p>
                <p>3. If you are sitting in someone else's slot and the slot owner complains, you will be removed. Sit in your slots to avoid removal.</p>
                <p>4. Each team must have at least 3 players.</p>
                <p>5. The match will start 10 minutes after announcing the room details.</p>
                <p>6. Teams must keep gameplay recordings for proof. If there are any allegations or suspicions, you can provide proof. Failure to provide recordings may result in action against your team.</p>
                <p>7. Your team format must include at least 3 players with matching in-game names and UID.</p>
                <p>8. The ID level must be at least 40+.</p>
                <p>9. Your team must have all registered players. Playing with less than 2 registered players will result in disqualification.</p>
                <p>10. If you provide details for 3 players but only 1 registered player is playing, your team will be disqualified from that match. You must have at least 2 registered players playing.</p>
                <p>11. Your in-game name must be an exact copy. For example, if your name is Str iker X JOD, you must use Strik er x JOD exactly. If your name is different, and the management is unable to find your team/player name, then management will not be responsible for different result.</p>
                <p>12. Each in-game name and UID can only play in one team on that day. If a player is found in multiple teams, that team will be disqualified.</p>
                <p>13. Playing in different teams with the same UID or in-game name is not allowed. Your in-game name must not be the same in different teams.</p>
                <p>14. If you notice any mistakes in the results after declared, contact the WhatsApp support number immediately. Please note that no complaints will be accepted after 30 minutes of the result being declared. Contact us within 30 minutes with proof if you have any queries.</p>
                <p>15. Prize money will be added to your wallet within 2 hours of the result declaration.</p>
                <p>16. iPads and emulator players are not allowed.</p>
                <p>18. If you encounter any issues, you can contact us on Discord or WhatsApp for support. Discord link: </p>
                <p>19. For direct WhatsApp support, click on the following link: <a href="https://wa.me/+917667747539" className="underline">WhatsApp Support</a></p>
                <p className="mt-4">Tip: You can add 4 players to your team and make your clan tag the same. This will help the management team easily identify your team in the results.</p>
                <p>Wishing all participants the best of luck!</p>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-white mb-6">{match.name} Details</h1>
      {renderMatchCard()}
      {renderTabs()}
      <section>{renderContent()}</section>
    </div>
  );
};

export default MatchDetails;