import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

const Home = () => {
    const [matches, setMatches] = useState({
        upcoming: [],
        ongoing: [],
        completed: []
    });
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
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
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`/team?userId=${userId}`);
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
            const userId = localStorage.getItem('userId');
            await axios.post(`/tournament/matches/${selectedMatchId}/join`, {
                userId,
                teamId: selectedTeam
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
                            setSelectedMatchId(match.id);
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
        <div className="modal">
            <div className="modal-box">
                <h2>Select a Team</h2>
                <ul>
                    {teams.map(team => (
                        <li key={team.id} onClick={() => setSelectedTeam(team.id)}>
                            <h3>{team.name}</h3>
                            <p>Members: {team.members.join(', ')}</p>
                        </li>
                    ))}
                </ul>
                <div className="modal-action">
                    <button onClick={handleJoin} className="btn btn-primary">Join with Selected Team</button>
                    <button onClick={() => setShowModal(false)} className="btn">Cancel</button>
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
            {showModal && renderTeamModal()}
        </div>
    );
};

export default Home;