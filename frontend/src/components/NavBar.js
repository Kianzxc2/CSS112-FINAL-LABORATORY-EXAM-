import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const NavBar = () => {
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleHomeClick = () => {
        if (isLoggedIn) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else if(user.role === 'patient'){
                navigate('/patient-home');
            }else if(user.role === 'doctor'){
                navigate('/doctor-appointment');
            }else if(user.role === 'receptionist'){
                navigate('/receptionist');
            }else if(user.role === 'user'){
                navigate('/user');
            }
        } else {
            navigate('/login');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <button className="navbar-brand btn btn-link" onClick={handleHomeClick}>
                    Hospital Management System
                </button>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                {user?.role === 'admin' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin">Users</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/manage-doctors">Manage Doctors</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/manage-patients">Manage Patients</Link>
                                        </li>
                                    </>
                                )}
                                {user?.role === 'patient' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/patient-medical-history">Medical Records</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/patient-appointment">Appointments</Link>
                                        </li>
                                    </>
                                )}
                                {user?.role === 'receptionist' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/receptionist-manage-patients"> Manage Patients</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/receptionist">All Appointments</Link>
                                        </li>
                                    </>
                                )}
                                {user?.role === 'doctor' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/doctor-patients-list">Patients List</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/doctor-appointment">My Appointments</Link>
                                        </li>
                                    </>
                                )}
                                {user?.role === 'user' && (
                                    <>
                                       <p>User</p>
                                    </>
                                )}
                                <li className="nav-item">
                                    <button className="btn btn-outline-light" onClick={handleLogout}>Sign Out</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
