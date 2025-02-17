// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ setIsLoggedIn }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for delete account dialog
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false); // Update login state
    navigate("/login"); // Redirect to login page
  };

  // Delete account function
  const handleDeleteAccount = async () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) return;

    try {
      await axios.delete("http://localhost:8081/deleteAccount", {
        data: { username: loggedInUser }, // Send username in the request body
      });
      alert("Account deleted successfully.");
      handleLogout(); // Logout after account deletion
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <header>
      <div
        className="navbar navbar-expand-lg navbar-dark"
        style={{
          backgroundColor: "#343a40",
          margin: "0", // Ensure no margin around the navbar
        }}
      >
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/home" className="navbar-brand d-flex align-items-center">
            <img
              src="/favicon.ico"
              alt="favicon"
              style={{
                width: "30px",
                height: "30px",
                marginRight: "10px", // Space between icon and text
              }}
            />
            <h1 style={{ color: "#ffffff", margin: 0 }}>Home Haven Travels</h1>
          </Link>
          <div className="d-flex align-items-center">
            <nav className="ms-3">
              <ul className="navbar-nav d-flex flex-row">
                <li className="nav-item">
                  <Link to="/about" className="nav-link text-light" style={{ fontSize: "1.2rem" }}>
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/ticketing" className="nav-link text-light" style={{ fontSize: "1.2rem" }}>
                    Ticketing
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="d-flex align-items-center ms-3">
              <button
                className="navbar-toggler d-flex align-items-center"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarHeader"
                aria-controls="navbarHeader"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <p className="mb-0 me-2 text-light" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                  Destinations
                </p>
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* Account Settings Dropdown */}
              <div className="dropdown ms-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="accountSettingsDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontSize: "1rem",
                    whiteSpace: "nowrap", // Ensure button text fits
                  }}
                >
                  Account Settings
                </button>
                <ul className="dropdown-menu" aria-labelledby="accountSettingsDropdown">
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      Delete Account
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="collapse"
        id="navbarHeader"
        style={{
          backgroundColor: "#042b62", // Matches the navbar background
          padding: "0", // No padding to avoid spacing
          margin: "0", // No margin
        }}
      >
        <div
          className="d-flex justify-content-start align-items-center py-3"
          style={{
            backgroundColor: "#1d232e", // Matches the navbar background
            paddingLeft: "110px", // Add some left padding for spacing
          }}
        >
          <Link
            to="/dest1"
            style={{
              textDecoration: "none",
              marginRight: "30px", // Add spacing between links
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Paris
          </Link>
          <Link
            to="/dest2"
            style={{
              textDecoration: "none",
              marginRight: "30px", // Add spacing between links
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Bali
          </Link>
          <Link
            to="/dest3"
            style={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            New York City
          </Link>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Account</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowDeleteDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
