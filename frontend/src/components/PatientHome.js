import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const PatientHome = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            fetchAppointments(user.id);
        }
    }, [user]);

    const fetchAppointments = async (patientId) => {
        try {
            const response1 = await axios.get(`http://127.0.0.1:8000/api/patients/${user.id}`);
            const response = await axios.get(`http://127.0.0.1:8000/api/patients/${response1.data.patient.id}/appointments`);
            const appointmentsData = response.data.appointments || [];
            const formattedAppointments = appointmentsData.map(appointment => {
                const [date, time] = appointment.appointment_date.split(' ');
                const formattedTime = convertTo12HourFormat(time);
                return { ...appointment, date, time: formattedTime  };
            });

            setAppointments(formattedAppointments || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
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

        return `${hour}:${minutes} ${period}`;
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h1 className="text-center">Welcome, {user && user.name}</h1>
                </div>
                <div className="card-body">
                    <h2>Your Appointments</h2>
                    {appointments.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Doctor</th>
                                        <th>Specialization</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.time}</td>
                                            <td>{appointment.doctor_name}</td>
                                            <td>{appointment.specialization}</td>
                                            <td>{appointment.status}</td>
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
        </div>
    );
};

export default PatientHome;
