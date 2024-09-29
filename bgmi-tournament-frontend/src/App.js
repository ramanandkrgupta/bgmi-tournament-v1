import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;