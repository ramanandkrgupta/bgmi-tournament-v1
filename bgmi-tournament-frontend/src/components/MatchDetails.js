import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`/tournament/matches/${id}`);
        setMatch(response.data);
        const teamsResponse = await axios.get(`/tournament/matches/${id}/teams`);
        setTeams(teamsResponse.data);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [id]);

  if (!match) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-white mb-6">{match.name} Details</h1>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Match Details</h2>
        <p className="text-white">Prizepool: {match.prize} INR</p>
        <p className="text-white">Rules: {match.rules}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Joined Teams</h2>
        <ul>
          {teams.map(team => (
            <li key={team._id} className="text-white">{team.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchDetails;