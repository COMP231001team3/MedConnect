import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./patientProfile.css";
import profileImage from "./profile.jpg";

function ReceptionistProfile() {
  return (
    <section className="patientProfile">
      <div className="bar">
        <p>MEDCONNECT</p>
        <button className="btn btn-secondary">Configuration</button>
      </div>
      <div className="containerProfile">
        <div className="profile">
          <h2>Receptionist Profile</h2>
          <div className="patientInf">
            <p>Informations:</p>
            <img
              src={profileImage}
              alt="Profile image"
              width="150"
              height="100"
              className="d-inline-block align-text-top mb-3"
            />
            <p>Name:</p>
            <p>Email:</p>
          </div>
          <div className="options">
            <button className="btn">View and Edit Profile</button>
            <button className="btn">Calendar</button>
            <button className="btn">Appointments History</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReceptionistProfile;
