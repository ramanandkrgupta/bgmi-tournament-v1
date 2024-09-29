import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

const Home = () => {
    const [matches, setMatches] = useState({
        upcoming: [],
        ongoing: [],
        completed: []
    });
    const [teams, setTeams] = useState([]);
    const [teamSelection, setTeamSelection] = useState({});

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('/tournament/matches');
                setMatches(response.data);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        const fetchTeams = async () => {
            try {
                //const userId = localStorage.getItem('userId');
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
        try {
            //const userId = localStorage.getItem('userId');
            await axios.post(`/tournament/matches/${selectedMatchId}/join`, {
               
                teamId: selectedTeamId
            });
            alert('Successfully joined the match');
            setShowModal(false);
        } catch (error) {
            alert(error.response.data);
        }
    };

    const renderMatchCard = (match, canJoin) => (
        <div key={match.id} className="card w-full bg-gray-800 text-white shadow-md mb-4">
            <div className="card-body">
                <h3 className="card-title">{match.title}</h3>
                <p>{match.details}</p>
                <p>Entry Fee: {match.entryFee}</p>
                {canJoin && 
                    <button 
                        onClick={() => {
                            setSelectedMatchId(match._id);
                            setShowModal(true);
                        }} 
                        className="btn btn-primary mt-2"
                    >
                        Join
                    </button>
                }
            </div>
        </div>
    );

    const renderTeamModal = () => (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center ${showModal ? 'block' : 'hidden'}`} 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Backdrop
        >
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Select a Team</h2>
                <select
                    value={selectedTeamId || ''} 
                    onChange={(e) => setSelectedTeamId(e.target.value)} 
                    className="w-full p-3 border rounded-md bg-gray-100"
                >
                    <option value="" disabled>Select your team</option>
                    {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                            {team.name} - Members: {team.members.join(', ')}
                        </option>
                    ))}
                </select>
                <div className="mt-4 flex justify-end space-x-2">
                    <button 
                        onClick={handleJoin} 
                        className={`btn ${selectedTeamId ? 'btn-primary' : 'btn-disabled'}`}
                        disabled={!selectedTeamId} 
                    >
                        Join with Selected Team
                    </button>
                    <button 
                        onClick={() => setShowModal(false)} 
                        className="btn btn-secondary"
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
                {matches.upcoming.map(match => renderMatchCard(match, true))}
            </section>
            <section>
                <h2 className="text-3xl font-bold text-green-500 mb-4">Ongoing Matches</h2>
                {matches.ongoing.map(match => renderMatchCard(match, false))}
            </section>
            <section>
                <h2 className="text-3xl font-bold text-red-500 mb-4">Completed Matches</h2>
                {matches.completed.map(match => renderMatchCard(match, false))}
            </section>
            {renderTeamModal()}
        </div>
    );
};

export default Home;