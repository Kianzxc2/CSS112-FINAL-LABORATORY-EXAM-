import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Adjust the import path as per your project structure

const AppointmentPage = () => {
    const { user } = useAuth(); // Access user from AuthContext

    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        time: '00:00',
        doctorId: '',
        reason: ''
    });
    const [rescheduleFormData, setRescheduleFormData] = useState({
        date: '',
        time: ''
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            fetchAppointments(user.id); // Fetch appointments for logged-in user
            fetchDoctors(); // Fetch list of doctors
        }
    }, [user]);

    const fetchAppointments = async (userId) => {
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

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors');
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/appointments/${appointmentId}/cancel`);
            // Remove the canceled appointment from the local state
            setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
        } catch (error) {
            console.error('Error canceling appointment:', error);
        }
    };

    const rescheduleAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setRescheduleFormData({
            date: appointment.date,
            time: appointment.time
        });
        setShowRescheduleModal(true);
    };

    const handleModalOpen = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(convertTo24Hour(rescheduleFormData.time));
            const response = await axios.put(`http://127.0.0.1:8000/api/appointments/resched/${selectedAppointment.id}`, {
                appointment_date: `${rescheduleFormData.date} ${convertTo24Hour(rescheduleFormData.time)}`
            });
            // Update the appointment in the local state
            setAppointments(appointments.map(appointment => 
                appointment.id === selectedAppointment.id ? response.data.appointment : appointment
            ));
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
            fetchAppointments();
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const patient = await axios.get(`http://127.0.0.1:8000/api/patients/${user.id}`);
            const response = await axios.post('http://127.0.0.1:8000/api/appointments', {
                patient_id: patient.data.patient.id,
                doctor_id: formData.doctorId,
                appointment_date: `${formData.date} ${convertTo24Hour(formData.time)}`,
                reason: formData.reason
            });

            const newAppointment = response.data.appointment;
            setAppointments([...appointments, newAppointment]);
            setShowModal(false);
            setFormData({
                date: '',
                time: '00:00',
                doctorId: '',
                reason: ''
            });
            fetchAppointments();
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let i = 0; i < 24; i++) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const period = i < 12 ? 'AM' : 'PM';
            ['00', '15', '30', '45'].forEach(minute => {
                const time = `${hour}:${minute} ${period}`;
                times.push(time);
            });
        }
        return times;
    };

    const convertTo24Hour = (time12h) => {
        
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
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

        return `${hour}:${minutes} ${period}`;
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Appointments</h1>
            <button className="btn btn-primary mb-3" onClick={handleModalOpen}>Book Appointment</button>
            {appointments.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.doctor_name}</td>
                                    <td>{appointment.specialization}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        {appointment.status !== 'completed' && (
                                            <>
                                                <button
                                                    className="btn btn-danger btn-sm me-2"
                                                    onClick={() => cancelAppointment(appointment.id)}
                                                >
                                                    Cancel
                                                </button>
                                                
                                            </>
                                        )}
                                        {appointment.status == 'pending' && (
                                            <>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => rescheduleAppointment(appointment)}
                                                >
                                                    Reschedule
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No appointments found.</p>
            )}
            {/* Modal for Rescheduling */}
            {selectedAppointment && (
                <div className={`modal ${showRescheduleModal ? 'show' : ''}`} style={{ display: showRescheduleModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reschedule Appointment</h5>
                                <button type="button" className="btn btn-danger btn-close" onClick={() => setShowRescheduleModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleRescheduleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label">Date</label>
                                        <input 
                                            type="date" 
                                            className="form-control" 
                                            id="date" 
                                            value={rescheduleFormData.date} 
                                            onChange={(e) => setRescheduleFormData({ ...rescheduleFormData, date: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="time" className="form-label">Time</label>
                                        <select 
                                            className="form-control" 
                                            id="time" 
                                            value={rescheduleFormData.time} 
                                            onChange={(e) => setRescheduleFormData({ ...rescheduleFormData, time: e.target.value })} 
                                            required
                                        >
                                            {generateTimeOptions().map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowRescheduleModal(false)}>Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal for booking appointment */}
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : ""}}>
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Book Appointment</h5>
                    <button type="button" className="btn btn-danger btn-close" onClick={handleModalClose}>&times;</button>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="time" className="form-label">Time</label>
                            <select
                                className="form-control"
                                id="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            >
                                {generateTimeOptions().map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="doctorId" className="form-label">Doctor</label>
                            <select
                                className="form-control"
                                id="doctorId"
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                required
                                style={{ color: 'black' }} // Set text color to black for all options
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
                            <label htmlFor="reason" className="form-label">Reason</label>
                            <textarea
                                className="form-control"
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                        <button type="submit" className="btn btn-primary">Book Appointment</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
);
};
        
        export default AppointmentPage;
        