import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        mobile: '',
        referredBy: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/auth/register', formData);
            alert('User registered successfully');
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="input input-bordered w-full mb-2" />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input input-bordered w-full mb-2" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="input input-bordered w-full mb-2" />
                <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleChange} required className="input input-bordered w-full mb-2" />
                <input type="text" name="referredBy" placeholder="Referral Code" onChange={handleChange} className="input input-bordered w-full mb-4" />
                <button type="submit" className="btn btn-primary w-full">Register</button>
            </form>
        </div>
    );
};

export default Registration;