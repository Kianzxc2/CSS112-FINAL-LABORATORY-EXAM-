import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminHomepage from './components/AdminHomepage';
import NavBar from './components/NavBar';
import Register from './components/Register';
import ManageDoctors from './components/ManageDoctors';
import ManagePatients from './components/ManagePatients';
import './styles.css';
import ProtectedRoute from './components/ProtectedRoute';
import PatientHome from './components/PatientHome';
import MedicalRecords from './components/MedicalRecords.js';
import AppointmentPage from './components/AppointmentPage';
import ReceptionistPage from './components/ReceptionistPage.js';
import DoctorPage from './components/DoctorPage.js';
import DoctorPatientList from './components/DoctorPatientList.js';
import UserDoctorList from './components/UserDoctorList.js';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute role="admin">
            <AdminHomepage />
            </ProtectedRoute>
          }/>
          <Route path="/manage-doctors" element={
              <ProtectedRoute role="admin">
                <ManageDoctors />
              </ProtectedRoute>}/>
          <Route path="/manage-patients" element={
              <ProtectedRoute role="admin">
                <ManagePatients />
              </ProtectedRoute>}/>
          <Route path="/patient-home" element={
              <ProtectedRoute role="patient">
                <PatientHome />
              </ProtectedRoute>}/>
           <Route path="/patient-medical-history" element={
            <ProtectedRoute role="patient">
              <MedicalRecords />
            </ProtectedRoute>}/>
            <Route path="/patient-appointment" element={
              <ProtectedRoute role="patient">
                <AppointmentPage />
              </ProtectedRoute>}/>
            <Route path="/receptionist" element={
            <ProtectedRoute role="receptionist">
              <ReceptionistPage />
            </ProtectedRoute>}/>
            <Route path="/receptionist-manage-patients" element={
            <ProtectedRoute role="receptionist">
              <ManagePatients />
            </ProtectedRoute>}/>
            <Route path="/doctor-appointment" element={
              <ProtectedRoute role="doctor">
                <DoctorPage />
              </ProtectedRoute>}/>
              <Route path="/doctor-patients-list" element={
              <ProtectedRoute role="doctor">
                <DoctorPatientList />
              </ProtectedRoute>}/>
              <Route path="/user" element={
              <ProtectedRoute role="user">
                <UserDoctorList />
              </ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
