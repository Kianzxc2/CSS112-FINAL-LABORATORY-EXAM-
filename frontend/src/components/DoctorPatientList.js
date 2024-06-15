import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorPatientList = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddRecordModal, setShowAddRecordModal] = useState(false);
    const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
    const [showMedicalRecordsModal, setShowMedicalRecordsModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        first_name: '',
        last_name: '',
        date_of_birth: '2000-01-01',
        gender: 'other', // Updated for dropdown
        address: '',
        email: '',
        phone: '',
        emergency_contact: '',
    });
    const [recordData, setRecordData] = useState({
        patient_id: '',
        doctor_id: '',
        visit_date: '',
        diagnosis: '',
        treatment: '',
        notes: '',
    });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/patients');
            setPatients(response.data.users || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors');
            setDoctors(response.data.doctors || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleViewDetails = (patient) => {
        setFormData({
            id: patient.id,
            first_name: patient.first_name,
            last_name: patient.last_name,
            date_of_birth: patient.date_of_birth,
            gender: patient.gender,
            address: patient.address,
            email: patient.email,
            phone: patient.phone,
            emergency_contact: patient.emergency_contact,
        });
        setShowPatientDetailsModal(true);
    };

    const handleAddRecord = (patient) => {
        setRecordData({
            ...recordData,
            patient_id: patient.id,
        });
        setShowAddRecordModal(true);
    };

    const handleCloseModal = () => {
        setShowPatientDetailsModal(false);
        setShowAddRecordModal(false);
        setShowMedicalRecordsModal(false);
        setFormData({
            id: null,
            first_name: '',
            last_name: '',
            date_of_birth: '2001-01-01',
            gender: 'other',
            address: '',
            email: '',
            phone: '',
            emergency_contact: '',
        });
        setRecordData({
            patient_id: '',
            doctor_id: '',
            visit_date: '',
            diagnosis: '',
            treatment: '',
            notes: '',
        });
    };

    const handleRecordInputChange = (e) => {
        const { name, value } = e.target;
        setRecordData({
            ...recordData,
            [name]: value,
        });
    };

    const handleRecordSubmit = async (e) => {
        e.preventDefault();

        // Log the record data to be submitted
        console.log('Submitting record data:', recordData);
    
        // Validate the required fields
        if (!recordData.patient_id || !recordData.doctor_id || !recordData.visit_date || !recordData.diagnosis || !recordData.treatment) {
            console.error('All fields are required');
            return;
        }
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/medical_records', recordData);
            console.log('Record added successfully:', response.data);
            setShowAddRecordModal(false);
            // Optionally, update state or perform additional actions after successful submission
        } catch (error) {
            console.error('Error adding medical record:', error);
            console.error('Response data:', error.response?.data); // Log the response data for more insight
        }
    };

    const handleViewRecord = async (patient) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/doctor-medical_records/${patient.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSelectedPatientRecords(response.data.medical_records || []);
            setShowMedicalRecordsModal(true);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Patient List</h1>
            {patients.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient, index) => (
                                <tr key={patient.id}>
                                    <td>{index + 1}</td>
                                    <td>{patient.first_name}</td>
                                    <td>{patient.last_name}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.phone}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewDetails(patient)}>View</button>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleAddRecord(patient)}>Add Record</button>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleViewRecord(patient)}>View Record</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No patients found.</p>
            )}

            {/* Patient Details Modal */}
            <div className={`modal ${showPatientDetailsModal ? 'show' : ''}`} style={{ display: showPatientDetailsModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Patient Details</h5>
                            <button type="button" className="btn btn-danger btn-close" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
                            <p><strong>Date of Birth:</strong> {formData.date_of_birth}</p>
                            <p><strong>Gender:</strong> {formData.gender}</p>
                            <p><strong>Address:</strong> {formData.address}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Phone:</strong> {formData.phone}</p>
                            <p><strong>Emergency Contact:</strong> {formData.emergency_contact}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Record Modal */}
            <div className={`modal ${showAddRecordModal ? 'show' : ''}`} style={{ display: showAddRecordModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Medical Record</h5>
                            <button type="button" className="btn btn-danger btn-close" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleRecordSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="doctor_id" className="form-label">Doctor</label>
                                    <select className="form-control" id="doctor_id" name="doctor_id" value={recordData.doctor_id} onChange={handleRecordInputChange} required>
                                        <option value="">Select Doctor</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.doctor_id} value={doctor.doctor_id}>{doctor.first_name} {doctor.last_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="visit_date" className="form-label">Visit Date</label>
                                    <input type="date" className="form-control" id="visit_date" name="visit_date" value={recordData.visit_date} onChange={handleRecordInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="diagnosis" className="form-label">Diagnosis</label>
                                    <textarea className="form-control" id="diagnosis" name="diagnosis" value={recordData.diagnosis} onChange={handleRecordInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="treatment" className="form-label">Treatment</label>
                                    <textarea className="form-control" id="treatment" name="treatment" value={recordData.treatment} onChange={handleRecordInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="notes" className="form-label">Notes</label>
                                    <textarea className="form-control" id="notes" name="notes" value={recordData.notes} onChange={handleRecordInputChange} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                <button type="submit" className="btn btn-primary">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Medical Records Modal */}
            <div className={`modal ${showMedicalRecordsModal ? 'show' : ''}`} style={{ display: showMedicalRecordsModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Medical Records for {formData.first_name} {formData.last_name}</h5>
                            <button type="button" className="btn btn-danger btn-close" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {selectedPatientRecords.length > 0 ? (
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Diagnosis</th>
                                            <th>Treatment</th>
                                            <th>Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPatientRecords.map((record) => (
                                            <tr key={record.id}>
                                                <td>{record.visit_date}</td>
                                                <td>{record.diagnosis}</td>
                                                <td>{record.treatment}</td>
                                                <td>{record.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No medical records found.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorPatientList;
