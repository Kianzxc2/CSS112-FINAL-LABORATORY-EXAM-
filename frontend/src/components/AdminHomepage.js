
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '', password: '' });
    const [editedUser, setEditedUser] = useState(null);
    const [editedRowIndex, setEditedRowIndex] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [doctorInfo, setDoctorInfo] = useState({}); // State to store doctor info
    const [errors, setErrors] = useState({});
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };

    const handleAddUser = async () => {
        const validationErrors = validateUser(newUser);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/users', newUser);
            setNewUser({ name: '', email: '', role: '', password: '' });
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error.message);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = async () => {
        try {
            if (editedUser.role != 'doctor') {
                const id = users[editedRowIndex].id;
                const response = await axios.get(`http://127.0.0.1:8000/api/users/${id}`);
                const userData  = response.data.user;
                if (userData && userData.role == 'doctor') {
                    console.log('User is a doctor');
                    deleteDoctorData(users[editedRowIndex].id);
                    console.log('Deleted record on doctor table');
                } 
            }
            console.log(editedUser.id);
            await axios.put(`http://127.0.0.1:8000/api/users/${editedUser.id}`, editedUser);
            console.log('Update Complete');
            setEditedUser(null);
            setEditedRowIndex(-1);
            fetchUsers();
            
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleInputChange = (e, index, user) => {
        const { name, value } = e.target;
        const updatedUser = { ...user, [name]: value };
        setUsers(users.map((u, i) => (i === index ? updatedUser : u)));
        setEditedUser(updatedUser);
        setEditedRowIndex(index);
    };

    const handleRoleChange = (role, index, user) => {
        const updatedUser = { ...user, role };
        setUsers(users.map((u, i) => (i === index ? updatedUser : u)));
        setEditedUser(updatedUser);
        setEditedRowIndex(index);

        // Show modal form when changing role from 'patient' to 'doctor'
        if (role === 'doctor') {
            setShowModal(true);
        }
    };

    const deleteDoctorData = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/doctors/${id}`);
            fetchUsers(); 
        } catch (error) {
            console.error('Error deleting doctor data');
        }
    };


    const validateUser = (user) => {
        const errors = {};
        if (!user.name) errors.name = 'Name is required';
        if (!user.email) errors.email = 'Email is required';
        if (!user.password) errors.password = 'Password is required';
        if (!user.role) errors.role = 'Role is required';
        return errors;
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleModalClose = () => setShowModal(false);

    const handleDoctorInfoChange = (e) => {
        const { name, value } = e.target;
        setDoctorInfo({ ...doctorInfo, [name]: value });
    };

    const handleDoctorInfoSubmit = async () => {
        try {
            // Send user data along with doctor info to the backend
            const response = await axios.post('http://127.0.0.1:8000/api/users', { ...editedUser, ...doctorInfo });
            console.log(response.data); // Log response from backend
            setDoctorInfo({}); // Clear doctorInfo state
            setShowModal(false); // Close modal after submission
            fetchUsers(); // Fetch updated user list
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">User Management</h1>
            <div className="mb-4">
                <h2>User List</h2>
                <table className="table table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="name"
                                        value={user.name}
                                        onChange={(e) => handleInputChange(e, indexOfFirstUser + index, user)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        name="email"
                                        value={user.email}
                                        onChange={(e) => handleInputChange(e, indexOfFirstUser + index, user)}
                                    />
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            {capitalize(user.role)}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><button className="dropdown-item" onClick={() => handleRoleChange('admin', indexOfFirstUser + index, user)}>Admin</button></li>
                                            <li><button className="dropdown-item" onClick={() => handleRoleChange('doctor', indexOfFirstUser + index, user)}>Doctor</button></li>
                                            <li><button className="dropdown-item" onClick={() => handleRoleChange('receptionist', indexOfFirstUser + index, user)}>Receptionist</button></li>
                                            <li><button className="dropdown-item" onClick={() => handleRoleChange('patient', indexOfFirstUser + index, user)}>Patient</button></li>
                                        </ul>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                    {editedRowIndex === indexOfFirstUser + index && (
                                        <button className="btn btn-primary btn-sm ms-2" onClick={handleEditUser}>Update</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
                            <li key={i + 1} className="page-item">
                                <button onClick={() => paginate(i + 1)} className="page-link">
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div>
                <h2>Add New User</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control mb-2 ${errors.name ? 'is-invalid' : ''}`}
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    <input
                        type="email"
                        className={`form-control mb-2 ${errors.email ? 'is-invalid' : ''}`}
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Email"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    <input
                        type="password"
                        className={`form-control mb-2 ${errors.password ? 'is-invalid' : ''}`}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Password"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    <select
                        className={`form-control mb-2 ${errors.role ? 'is-invalid' : ''}`}
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="doctor">Doctor</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="patient">Patient</option>
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                    <button className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
