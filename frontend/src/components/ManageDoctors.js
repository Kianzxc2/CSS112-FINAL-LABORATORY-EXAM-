import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({
        first_name: '',
        last_name: '',
        specialization: '',
        license_number: '',
        phone: '',
        email: '',
        password: ''
    });
    const [editedDoctor, setEditedDoctor] = useState(null);
    const [editedRowIndex, setEditedRowIndex] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(10);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors');
            console.log('Doctors API response:', response.data); // Log API response
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleAddDoctor = async () => {
        try {
            console.log('Adding doctor:', newDoctor);
            await axios.post('http://127.0.0.1:8000/api/doctors', newDoctor);
            console.log('Doctor added successfully!'); // Debugging output
            setNewDoctor({
                first_name: '',
                last_name: '',
                specialization: '',
                license_number: '',
                phone: '',
                email: '',
                password: ''
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };

    // const handleDeleteDoctor = async (id) => {
    //     try {
    //         await axios.delete(`http://127.0.0.1:8000/api/doctors/${id}`);
    //         //console.log(doctor.id);
    //         fetchDoctors();
    //     } catch (error) {
    //         console.error('Error deleting doctor:', error);
    //     }
    // };

    const handleDeleteDoctor = async (doctor_id) => {
        console.log('Deleting doctor with ID:', doctor_id); // Add this line for debugging
        try {
            await axios.delete(`http://127.0.0.1:8000/api/doctors/${doctor_id}`);
            fetchDoctors(); // Refresh doctor list after deletion
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    const handleEditDoctor = async () => {
        try {
            console.log(editedDoctor.doctor_id);
            await axios.put(`http://127.0.0.1:8000/api/doctors/${editedDoctor.doctor_id}`, editedDoctor);
            setEditedDoctor(null);
            setEditedRowIndex(-1);
            fetchDoctors();
        } catch (error) {
            console.error('Error updating doctor:', error);
        }
    };

    const handleInputChange = (e, index, doctor) => {
        const { name, value } = e.target;
        const updatedDoctor = { ...doctor, [name]: value };
        setDoctors(doctors.map((d, i) => (i === index ? updatedDoctor : d)));
        setEditedDoctor(updatedDoctor);
        setEditedRowIndex(index);
    };

    // Pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Manage Doctors</h1>
            <div className="mb-4">
                <h2>Doctor List</h2>
                <table className="table table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Specialization</th>
                            <th>License Number</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDoctors.map((doctor, index) => (
                            <tr key={doctor.id}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="first_name"
                                        value={doctor.first_name||''}
                                        onChange={(e) => handleInputChange(e, index, doctor)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="last_name"
                                        value={doctor.last_name||''}
                                        onChange={(e) => handleInputChange(e, index, doctor)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="specialization"
                                        value={doctor.specialization||''}
                                        onChange={(e) => handleInputChange(e, index, doctor)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="license_number"
                                        value={doctor.license_number||''}
                                        onChange={(e) => handleInputChange(e, index, doctor)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        name="phone"
                                        value={doctor.phone||''}
                                        onChange={(e) => handleInputChange(e, index, doctor)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        name="email"
                                        value={doctor.email||''}
                                        onChange={(e) => handleInputChange(e, index, doctor)}
                                    />
                                </td>
                               
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDoctor(doctor.doctor_id)}>Delete</button>
                                    {editedRowIndex === index && (
                                        <button className="btn btn-primary btn-sm ms-2" onClick={handleEditDoctor}>Update</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(doctors.length / doctorsPerPage) }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(i + 1)} className="page-link">
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Add New Doctor</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={newDoctor.first_name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, first_name: e.target.value })}
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={newDoctor.last_name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, last_name: e.target.value })}
                        placeholder="Last Name"
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={newDoctor.specialization}
                        onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                        placeholder="Specialization"
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={newDoctor.license_number}
                        onChange={(e) => setNewDoctor({ ...newDoctor, license_number: e.target.value })}
                        placeholder="License Number"
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                        placeholder="Phone"
                    />
                    <input
                        type="email"
                        className="form-control mb-2"
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        className="form-control mb-2"
                        value={newDoctor.password}
                        onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                        placeholder="Password"
                    />
                    <button className="btn btn-primary" onClick={handleAddDoctor}>Add Doctor</button>
                </div>
            </div>
        </div>
    );
};

export default ManageDoctors;
