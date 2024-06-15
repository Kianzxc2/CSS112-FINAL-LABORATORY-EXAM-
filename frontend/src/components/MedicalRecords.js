import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Adjust the path as per your file structure

const MedicalRecords = () => {
    const { user } = useAuth(); // Accessing user from AuthContext
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return; // If user is not logged in, return early

        fetchMedicalRecords();
    }, [user]); // Fetch records whenever user changes

    const fetchMedicalRecords = async () => {
        try {
            const response1 = await axios.get(`http://127.0.0.1:8000/api/patients/${user.id}`);
            console.log(response1.data.patient.id);
            const response = await axios.get(`http://127.0.0.1:8000/api/medical_records/${response1.data.patient.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust token handling as per your setup
                },
            });

            const recordsWithDoctorName = response.data.medical_records.map(record => ({
                ...record,
                doctor_name: `${record.doctor.first_name} ${record.doctor.last_name}`,
            }));
            setMedicalRecords(recordsWithDoctorName || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching medical records:', error);
            setLoading(false);
        }
    };

    if (!user) {
        return <p>Please log in to view medical records.</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Medical Records</h1>
            {medicalRecords.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Doctor Name</th>
                                <th>Visit Date</th>
                                <th>Diagnosis</th>
                                <th>Treatment</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalRecords.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{record.doctor_name}</td>
                                    <td>{record.visit_date}</td>
                                    <td>{record.diagnosis}</td>
                                    <td>{record.treatment}</td>
                                    <td>{record.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No medical records found.</p>
            )}
        </div>
    );
};

export default MedicalRecords;
