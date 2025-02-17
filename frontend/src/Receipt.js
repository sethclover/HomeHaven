// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Receipt = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleReturnToHome = async () => {
    try {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        await axios.put("http://localhost:8081/resetUserData", {
          username: loggedInUser,
        });
        console.log("User data reset successfully.");
      }
    } catch (error) {
      console.error("Error resetting user data:", error);
    }
    navigate("/");
  };

  if (!state) {
    return <p>No purchase details found.</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center">Thank you for your purchase!</h1>
      <p className="mt-4 text-center">
        You have booked your destination to <strong>{state.destination}</strong>,
        starting from <strong>{state.startDate}</strong> to <strong>{state.endDate}</strong>.
      </p>
      <ul className="list-unstyled text-center">
        <li>Adult Tickets: {state.adultTickets} (${(state.adultTickets * 200).toFixed(2)})</li>
        <li>Child Tickets: {state.childTickets} (${(state.childTickets * 150).toFixed(2)})</li>
      </ul>
      <h4 className="text-center">Grand Total: ${state.total.toFixed(2)}</h4>

      <hr />

      <div className="mt-4">
        <h4 className="text-center">Personal Information</h4>
        <p className="text-center">Name: {state.personalInfo?.name || "N/A"}</p>
        <p className="text-center">Email: {state.personalInfo?.email || "N/A"}</p>
        <p className="text-center">Phone: {state.personalInfo?.phone || "N/A"}</p>

        <hr />

        <h4 className="text-center">Card Information</h4>
        <p className="text-center">
          Card Number: **** **** **** {state.cardInfo?.cardNumber?.slice(-4) || "N/A"}
        </p>
        <p className="text-center">Expiration Date: {state.cardInfo?.expirationDate || "N/A"}</p>

        <hr />

        <h4 className="text-center">Address Information</h4>
        <p className="text-center">Street Address: {state.addressInfo?.street || "N/A"}</p>
        <p className="text-center">City: {state.addressInfo?.city || "N/A"}</p>
        <p className="text-center">State: {state.addressInfo?.state || "N/A"}</p>
        <p className="text-center">Zip Code: {state.addressInfo?.zip || "N/A"}</p>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={handleReturnToHome}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Receipt;
