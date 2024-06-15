import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReceptionistPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
    });

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const [appointmentsResponse, doctorsResponse, patientResponse] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/appointments'),
                axios.get('http://127.0.0.1:8000/api/doctors'),
                axios.get('http://127.0.0.1:8000/api/patients')
            ]);

            const appointmentsData = appointmentsResponse.data.appointments || [];
            const doctorsData = doctorsResponse.data.doctors || [];
            const patientsData = patientResponse.data.users || [];

            const doctorsMap = doctorsData.reduce((map, doctor) => {
                map[doctor.doctor_id] = {
                    name: `${doctor.first_name} ${doctor.last_name}`
                };
                return map;
            }, {});
            const patientMap = patientsData.reduce((map, patient) => {
                map[patient.id] = {
                    name: `${patient.first_name} ${patient.last_name}`
                };
                return map;
            }, {});
            
            const formattedAppointments = appointmentsData.map(appointment => {
                const [date, time] = appointment.appointment_date.split(' ');
                const formattedTime = convertTo12HourFormat(time);
                
                const doctorInfo = doctorsMap[appointment.doctor_id] || { name: 'Unknown Doctor' };
                const patientInfo = patientMap[appointment.patient_id] || { name: 'Unknown Patient'};
                return {
                    ...appointment,
                    date,
                    time: formattedTime,
                    doctor_name: doctorInfo.name,
                    patient_name: patientInfo.name
                };
            });
            setAppointments(formattedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors');
            const doctorsData = response.data.doctors || [];
            setDoctors(doctorsData);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/patients');
            const patientsData = response.data.users || [];
            setPatients(patientsData);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const convertTo24HourFormat = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');
        }

        return `${hours}:${minutes}`;
    };

    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(':');
        let period = 'AM';
        let hour = parseInt(hours, 10);

        if (hour >= 12) {
            period = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }

        if (hour === 0) {
            hour = 12;
        }

        return `${hour.toString().padStart(2, '0')}:${minutes} ${period}`;
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += 30) {
                const hour = i.toString().padStart(2, '0');
                const minute = j.toString().padStart(2, '0');
                times.push(convertTo12HourFormat(`${hour}:${minute}`));
            }
        }
        return times;
    };

    const handleDeleteAppointment = async (appointmentId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/appointments/${appointmentId}`);
            fetchAppointments(); // Refresh appointments after deletion
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const handleNewAppointmentChange = (e) => {
        const { name, value } = e.target;
            console.log(value);
        setNewAppointment({
            ...newAppointment,
            [name]: value,
        });
    };

    const handleNewAppointmentSubmit = async (e) => {
        e.preventDefault();
        const appointmentDateTime = `${newAppointment.appointmentDate} ${convertTo24HourFormat(newAppointment.appointmentTime)}`;

        try {
            const newAppointmentData = {
                patient_id: newAppointment.patientId,
                doctor_id: newAppointment.doctorId,
                appointment_date: appointmentDateTime,
                reason: newAppointment.reason
            };
            await axios.post('http://127.0.0.1:8000/api/appointments', newAppointmentData);
            fetchAppointments();
            setNewAppointment({
                patientId: '',
                doctorId: '',
                appointmentDate: '',
                appointmentTime: '',
                reason: '',
            });
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/appointments/${appointmentId}`, { status: newStatus });
            fetchAppointments(); // Refresh appointments after updating the status
        } catch (error) {
            console.error(`Error updating appointment status to ${newStatus}:`, error);
        }
    };
    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h1 className="text-center">Receptionist Dashboard</h1>
                </div>
                <div className="card-body">
                    <h2>All Appointments</h2>
                    {appointments.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Doctor</th>
                                        <th>Patient</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.time}</td>
                                            <td>{appointment.doctor_name}</td>
                                            <td>{appointment.patient_name}</td>
                                            <td>{appointment.status}</td>
                                            <td>
                                            <select
                                                    className="form-control form-control-sm"
                                                    value={appointment.status}
                                                    onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                                                    style={{ color: 'black' }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center">No appointments found.</p>
                    )}
                </div>
            </div>

            {/* New Appointment Form */}
            <div className="card mt-4">
                <div className="card-header">
                    <h2>Add New Appointment</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleNewAppointmentSubmit}>
                        <div className="mb-3">
                            <label htmlFor="patientId" className="form-label">Patient</label>
                            <select
                                className="form-control"
                                id="patientId"
                                name="patientId"
                                value={newAppointment.patientId}
                                onChange={handleNewAppointmentChange}
                                required
                                style={{ color: 'black' }}
                            >
                                <option value="" disabled>Select a patient</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.first_name + " " + patient.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="doctorId" className="form-label">Doctor</label>
                            <select
                                className="form-control"
                                id="doctorId"
                                name="doctorId"
                                value={newAppointment.doctorId}
                                onChange={handleNewAppointmentChange}
                                required
                                style={{ color: 'black' }}
                            >
                                <option value="" disabled>Select a doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                        {doctor.first_name + " " + doctor.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="appointmentDate" className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="appointmentDate"
                                name="appointmentDate"
                                value={newAppointment.appointmentDate}
                                onChange={handleNewAppointmentChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="appointmentTime" className="form-label">Time</label>
                            <select
                                className="form-control"
                                id="appointmentTime"
                                name="appointmentTime"
                                value={newAppointment.appointmentTime}
                                onChange={handleNewAppointmentChange}
                                required
                                style={{ color: 'black' }}
                            >
                                <option value="" disabled>Select a time</option>
                                {generateTimeOptions().map(time => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="reason" className="form-label">Reason</label>
                            <textarea
                                className="form-control"
                                id="reason"
                                name="reason"
                                value={newAppointment.reason}
                                onChange={handleNewAppointmentChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Add Appointment</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistPage;
