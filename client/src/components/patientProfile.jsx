import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./patientProfile.css";
import profileImage from "./profile.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/authContext";

{
  /*Patient profile with the dashboard
Story#4: As a patient, I can see a patient dashboard after logging in. On this page, I can access calendar, view/edit my profile, download/upload documents and manage appointments */
}
function PatientProfile() {
  const { currentUser } = useAuth();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fetch patient data from the backend API using the currentUser's email
        const response = await axios.get(`http://localhost:5000/patients/email/${currentUser.email}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
  
    if (currentUser) {
      fetchPatientData();
    }
  }, [currentUser]);  

  if (!patient) {
    return <div>Loading...</div>;
  }

  const handleCalendar = () => {
    // Navigate to the calendar page
    navigate("/calendar");
  };

  const handleMyFiles = () => {
    // Navigate to the my files page
    navigate(`/MyFiles/${patient._id}`);
  };

  return (
    <section className="patientProfile">
      <div className="bar">
        <p></p>
        {/*<button className="btn btn-secondary">Configuration</button>*/}
      </div>
      <div className="containerProfile">
        <div className="profile">
          <h2>Patient Profile</h2>
          <div className="patientInf">
            <p>Information:</p>
            <img
              src={profileImage}
              alt="Profile image"
              width="150"
              height="100"
              className="d-inline-block align-text-top mb-3"
            />
            <p>Name: {patient.name}</p>
            <p>Email: {patient.email}</p>
            <p>Birthday: {patient.birth}</p>
            <p>Cell: {patient.phone}</p>
            <p>Address: {patient.address}</p>
          </div>
          <div className="options">
            <button className="btn">View and Edit Profile</button>
            <button className="btn" onClick={handleCalendar}>
              Calendar
            </button>
            <button className="btn" onClick={handleMyFiles}>
              My Files
            </button>
            <button className="btn">Appointments History</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatientProfile;