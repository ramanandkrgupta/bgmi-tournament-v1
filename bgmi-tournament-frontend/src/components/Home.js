import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

const Home = () => {
    const [matches, setMatches] = useState({
        upcoming: [],
        ongoing: [],
        completed: []
    });

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('/tournament/matches');
                setMatches(response.data);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };
        fetchMatches();
    }, []);

    const handleJoin = async (matchId) => {
        try {
            await axios.post(`/tournament/matches/${matchId}/join`);
            alert('Successfully joined the match');
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
                {canJoin && <button onClick={() => handleJoin(match.id)} className="btn btn-primary mt-2">Join</button>}
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
        </div>
    );
};

export default Home;