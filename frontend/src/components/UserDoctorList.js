import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors');
            setDoctors(response.data.doctors || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Doctor List</h1>
            {doctors.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Phone</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor, index) => (
                                <tr key={doctor.id}>
                                    <td>{index + 1}</td>
                                    <td>{`${doctor.first_name} ${doctor.last_name}`}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.phone}</td>
                                    <td>{doctor.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No doctors found.</p>
            )}
        </div>
    );
};

export default UserDoctorList;
