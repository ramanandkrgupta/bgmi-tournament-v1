import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import BottomMenu from './components/BottomMenu';
import Login from './components/Login';
import Home from './components/Home';
// import Team from './components/Team';
// import Refer from './components/Refer';
// import Wallet from './components/Wallet';
import MatchDetails from './components/MatchDetails';
import Profile from './components/Profile';

function App() {
    return (
        <Router>
           
            <Routes>
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/match/:id" element={<MatchDetails />} />
                <Route path="/profile" element={<Profile />} />
      
            </Routes>
            <BottomMenu />
        </Router>
    );
}

// Sets up client-side routing using React Router v6,
// defining routes for registration, login, home, match details, and profile pages. 
// Includes a bottom menu for navigation.
export default App;