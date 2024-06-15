import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorPage = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/appointments');
            const appointmentsData = response.data.appointments || [];
            
            const formattedAppointments = await Promise.all(appointmentsData.map(async appointment => {
                const [date, time] = appointment.appointment_date.split(' ');
                const formattedTime = convertTo12HourFormat(time);

                // Fetch patient information for each appointment
                const patientResponse = await axios.get(`http://127.0.0.1:8000/api/getPatients/${appointment.patient_id}`);
                const patient = patientResponse.data.patient || {};

                return {
                    ...appointment,
                    date,
                    time: formattedTime,
                    patient_name: `${patient.first_name} ${patient.last_name}`,
                };
            }));

            // Filter out canceled and completed appointments
            const filteredAppointments = formattedAppointments.filter(appointment => appointment.status !== 'cancelled' && appointment.status !== 'completed');
            setAppointments(filteredAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/appointments/${appointmentId}/cancel`);
            // Refetch appointments after cancellation
            fetchAppointments();
        } catch (error) {
            console.error('Error canceling appointment:', error);
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
            <h1 className="mb-4">Appointments</h1>
            {appointments.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Patient</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.patient_name}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm me-2" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                                        {/* Add more actions if needed */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No appointments found.</p>
            )}
        </div>
    );
};

export default DoctorPage;
