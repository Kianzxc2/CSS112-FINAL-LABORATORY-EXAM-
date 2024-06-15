import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/login');
            }, 2000);
            setErrors({});
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Registration failed' });
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h2 className="mb-4">Register</h2>
                    {errors.general && <p className="text-danger">{errors.general}</p>}
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                            {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p className="text-success">Successfully registered!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
