import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'patient') {
                navigate('/patient-home');
            } else if (user.role === 'doctor') {
                navigate('/doctor-appointment');
            } else if (user.role === 'receptionist') {
                navigate('/receptionist');
            } else if (user.role === 'user') {
                navigate('/user');
            }
        }
    }, [isLoggedIn, navigate, user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                name,
                password
            });

            const { token, user } = response.data;
            login(user, token);

            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'patient') {
                navigate('/patient-home');
            } else if (user.role === 'doctor') {
                navigate('/doctor-appointment');
            } else if (user.role === 'receptionist') {
                navigate('/receptionist');
            } else if (user.role === 'user') {
                navigate('/user');
            }
        } catch (error) {
            setError('Invalid credentials: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button><span></span>
                <Link to="/register" className="btn btn-outline-primary">Register</Link>
            </form>
        </div>
    );
};

export default Login;
