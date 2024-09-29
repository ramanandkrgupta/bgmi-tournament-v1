// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', formData);
            alert('Login successful');
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="identifier" placeholder="Email/Mobile/Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;