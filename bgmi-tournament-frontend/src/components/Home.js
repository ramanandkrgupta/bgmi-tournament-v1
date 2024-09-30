import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig'; // Assuming you have axios setup

const Home = () => {
  const [matches, setMatches] = useState({
    upcoming: [],
    ongoing: [],
    completed: []
  });
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/tournament/matches');
        // Assuming backend returns matches categorized as upcoming, ongoing, completed
        setMatches(response.data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    const fetchTeams = async () => {
      try {
        // const userId = localStorage.getItem('userId'); 
        const response = await axios.get(`/team`);
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchMatches();
    fetchTeams();
  }, []);

  const handleJoin = async () => {
    if (!selectedTeamId || !selectedMatch?._id) {
      alert("Please select a team and a match.");
      return; 
    }
    try {
      // const userId = localStorage.getItem('userId');
      await axios.post(`/tournament/matches/${selectedMatch._id}/join`, {
        teamId: selectedTeamId
      });
      alert('Successfully joined the match');
      setShowModal(false);
      // Refresh matches data after joining (optional)
      // ... 
    } catch (error) {
      alert(error.response.data || "Error joining match.");
    }
  };

  const renderMatchCard = (match) => (
    <div 
      key={match._id} 
      className="bg-[#181818] rounded-lg p-4 mb-4 shadow-md relative" 
    >
      {/* Banner Image */}
      <img 
        src={match.bannerImage} 
        alt={`${match.name} Banner`} 
        className="h-48 w-full object-cover rounded-t-lg"
      /> 
  
      {/* Prizepool Section (Overlay) */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 rounded-t-lg p-2 flex justify-between items-center">
        <span className="text-white text-sm font-bold">PRIZEPOOL</span>
        <span className="text-yellow-400 text-2xl font-bold">{match.prize} INR</span>
      </div>
  
      {/* Match Details */}
      <div className="mt-2">
        <h2 className="text-white text-xl font-bold">{match.name}</h2>
        <p className="text-blue-500 text-lg font-bold ">
          <span className="font-semibold text-red-400">Start Date:</span> {new Date(match.startDate).toLocaleDateString()} {new Date(match.startDate).toLocaleTimeString()}
        </p>
  
        {/* Match Details Grid */}
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
          {/* ... Add more details as needed */}
          <div>
            <span className="text-gray-400 font-semibold">Joined:</span> 
            <span className="text-white ml-2"> {/* Replace with actual joined count */}{match.teams.length}/{match.maxTeamJoin}</span>
          </div> 
        </div> 
  
      </div>
  
      {/* Join Button */}
      {match.status === 'upcoming' && ( 
        <div>
        <button 
          onClick={() => { setSelectedMatch(match); setShowModal(true); }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold btn px-16 text-lg rounded-2xl mt-4 "
        >
          Join
        </button>,
        <button 
        onClick={() => { alert("hello") }}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold btn px-16 text-lg rounded-2xl mt-4"
      >
        Details
      </button>
      </div>
       
      )}
       
    </div>
  ); 

  const renderTeamModal = () => (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${showModal ? 'block' : 'hidden'}`} 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-[#181818] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Select a Team</h2>
         <select
          value={selectedTeamId || ''} 
          onChange={(e) => setSelectedTeamId(e.target.value)} 
          className="w-full p-3 border rounded-md bg-gray-100"
        >
          <option value="" disabled>Select your team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name} -
               Members: {team.members.join(', ')}
            </option>
          ))}
        </select>
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={handleJoin} 
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${selectedTeamId ? '' : 'opacity-50 cursor-not-allowed'}`}
            disabled={!selectedTeamId} 
          >
            Join with Selected Team
          </button>
          <button 
            onClick={() => setShowModal(false)} 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-white mb-6">BGMI Tournament</h1>
      <section>
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Upcoming Matches</h2>
        {matches.upcoming.map(match => renderMatchCard(match))}
      </section>
      <section>
        <h2 className="text-3xl font-bold text-green-500 mb-4">Ongoing Matches</h2>
        {matches.ongoing.map(match => renderMatchCard(match))}
      </section>
      <section>
        <h2 className="text-3xl font-bold text-red-500 mb-4">Completed Matches</h2>
        {matches.completed.map(match => renderMatchCard(match))}
      </section>
      {renderTeamModal()}
    </div>
  );
};

export default Home;