import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePatients = (props) => {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        emergency_contact: '',
        medical_history: ''
    });
    const [editedPatient, setEditedPatient] = useState(null);
    const [editedRowIndex, setEditedRowIndex] = useState(-1);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const patients = await axios.get('http://127.0.0.1:8000/api/patients');
            const data = Array.from(patients.data.users);
            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleAddPatient = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/patients', newPatient);
            setNewPatient({
                first_name: '',
                last_name: '',
                date_of_birth: '',
                gender: '',
                address: '',
                phone: '',
                email: '',
                emergency_contact: '',
                medical_history: ''
            });
            fetchPatients();
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };

    const handleDeletePatient = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/patients/${id}`);
            fetchPatients();
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleEditPatient = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/patients/${editedPatient.id}`, editedPatient);
            setEditedPatient(null);
            setEditedRowIndex(-1);
            fetchPatients();
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleInputChange = (e, index, patient) => {
        const { name, value } = e.target;
        const updatedPatient = { ...patient, [name]: value };
        setPatients(patients.map((p, i) => (i === index ? updatedPatient : p)));
        setEditedPatient(updatedPatient);
        setEditedRowIndex(index);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Manage Patients</h1>
            <div className="mb-4">
                <h2>Patient List</h2>
                <table className="table table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Emergency Contact</th>
                            <th>Medical History</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, index) => (
                            <tr key={patient.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="first_name"
                                        value={patient.first_name || ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="last_name"
                                        value={patient.last_name|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        name="date_of_birth"
                                        value={patient.date_of_birth|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="form-control form-control-sm"
                                        name="gender"
                                        value={patient.gender|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="address"
                                        value={patient.address|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="phone"
                                        value={patient.phone|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        name="email"
                                        value={patient.email|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="emergency_contact"
                                        value={patient.emergency_contact|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <textarea
                                        className="form-control form-control-sm"
                                        name="medical_history"
                                        value={patient.medical_history|| ''}
                                        onChange={(e) => handleInputChange(e, index, patient)}
                                    />
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePatient(patient.id)}>Delete</button>
                                    {editedRowIndex === index && (
                                        <button className="btn btn-primary btn-sm ms-2" onClick={handleEditPatient}>Update</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Add New Patient</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={newPatient.first_name|| ''}
                        onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={newPatient.last_name|| ''}
                        onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                        placeholder="Last Name"
                    />
                    <input
                        type="date"
                        className="form-control mb-2"
                        value={newPatient.date_of_birth|| ''}
                        onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                            placeholder="Date of Birth"
                            />
                            <select
                            className="form-control mb-2"
                            value={newPatient.gender|| ''}
                            onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                            >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            </select>
                            <input
                            type="text"
                            className="form-control mb-2"
                            value={newPatient.address|| ''}
                            onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                            placeholder="Address"
                            />
                            <input
                            type="text"
                            className="form-control mb-2"
                            value={newPatient.phone|| ''}
                            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                            placeholder="Phone"
                            />
                            <input
                            type="email"
                            className="form-control mb-2"
                            value={newPatient.email|| ''}
                            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                            placeholder="Email"
                            />
                            <input
                            type="text"
                            className="form-control mb-2"
                            value={newPatient.emergency_contact|| ''}
                            onChange={(e) => setNewPatient({ ...newPatient, emergency_contact: e.target.value })}
                            placeholder="Emergency Contact"
                            />
                            <textarea
                            className="form-control mb-2"
                            value={newPatient.medical_history|| ''}
                            onChange={(e) => setNewPatient({ ...newPatient, medical_history: e.target.value })}
                            placeholder="Medical History"
                            />
                            <button className="btn btn-primary" onClick={handleAddPatient}>Add Patient</button>
                            </div>
                            </div>
                            </div>
                            );
                            };
                            
                            export default ManagePatients;
