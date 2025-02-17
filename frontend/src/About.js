// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #ffffff, #e9ecef)",
    }}
  >
    {/* Main Content Section */}
    <div
      className="container text-center"
      style={{ flex: "1", padding: "20px 0" }}
    >
      {/* Header Section */}
      <div className="mb-5">
        <h1 className="display-4 fw-bold">About Us</h1>
        <hr
          className="w-50 mx-auto"
          style={{ borderTop: "3px solid #007bff" }}
        />
      </div>

      {/* Course and Team Information */}
      <div className="row justify-content-center gy-4">
        {/* Course Info Card */}
        <div className="col-md-4">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <div className="icon mb-3">
                <i
                  className="bi bi-journal-text"
                  style={{ fontSize: "3rem", color: "#007bff" }}
                ></i>
              </div>
              <h5 className="card-title fw-bold">Course Details</h5>
              <p>SE/ComS319 - Construction of User Interfaces</p>
              <p>Fall 2024</p>
              <p>Date: December 11, 2024</p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="col-md-4">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <div className="icon mb-3">
                <i
                  className="bi bi-people"
                  style={{ fontSize: "3rem", color: "#007bff" }}
                ></i>
              </div>
              <h5 className="card-title fw-bold">Team Members</h5>
              <p>
                <strong>Prakeerth Regunath</strong> -{" "}
                <a
                  href="mailto:pkregu22@iastate.edu"
                  className="text-primary text-decoration-none"
                >
                  pkregu22@iastate.edu
                </a>
              </p>
              <p>
                <strong>Seth Clover</strong> -{" "}
                <a
                  href="mailto:sclover@iastate.edu"
                  className="text-primary text-decoration-none"
                >
                  sclover@iastate.edu
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="col-md-4">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <div className="icon mb-3">
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "3rem", color: "#007bff" }}
                ></i>
              </div>
              <h5 className="card-title fw-bold">Instructor</h5>
              <p>
                <strong>Dr. Abraham N. Aldaco Gastelum</strong>
              </p>
              <p>
                <a
                  href="mailto:aaldaco@iastate.edu"
                  className="text-primary text-decoration-none"
                >
                  aaldaco@iastate.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Section */}
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-0">
          &copy; 2024 Home Haven Travels. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
);

export default About;
