// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import "bootstrap/dist/css/bootstrap.min.css";

const Dest2 = () => {
  const [bali, setBali] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/listDests")
      .then((response) => response.json())
      .then((data) => {
        const destination = data.find((dest) => dest.name === "Bali");
        setBali(destination);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleBookNow = async () => {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      alert("You must be logged in to book a destination.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8081/user?username=${loggedInUser}`);
      const userData = response.data;

      const currentDestination = userData.destination;

      if (currentDestination && currentDestination !== "Bali") {
        const confirmChange = window.confirm(
          "Warning: Booking this destination will reset your current booking. Do you want to continue?"
        );

        if (!confirmChange) return;
      }

      await axios.post("http://localhost:8081/updateDestination", {
        username: loggedInUser,
        destination: "Bali",
        adultTickets: 0,
        childTickets: 0,
        startDate: null,
        endDate: null,
      });

      localStorage.setItem("selectedDestination", "Bali");
      localStorage.setItem("adultTickets", 0);
      localStorage.setItem("childTickets", 0);

      navigate("/ticketing");
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("Failed to book destination. Please try again.");
    }
  };

  if (!bali) return <p>Loading...</p>;

  return (
    <div>
      <section
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url(http://localhost:8081/${bali.images[0]?.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "50vh",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1 className="display-4">
            {bali.name}, {bali.country}
          </h1>
          <p className="lead">{bali.Coverdescription}</p>
        </div>
      </section>
      <section className="container py-5">
        <h2>About {bali.name}</h2>
        <p>{bali.description[0]}</p>
        <div className="row align-items-center my-4">
          <div className="col-md-6">
            <h2>Experience Balinese Culture</h2>
            <p>{bali.description[1]}</p>
          </div>
          <div className="col-md-6">
            <img
              src={`http://localhost:8081/${bali.images[1]?.url}`}
              alt={bali.images[1]?.description}
              className="img-fluid rounded shadow-sm"
            />
          </div>
        </div>
        <div className="row align-items-center my-4">
          <div className="col-md-6 order-md-2">
            <h2>Relax in Paradise</h2>
            <p>{bali.description[2]}</p>
          </div>
          <div className="col-md-6 order-md-1">
            <img
              src={`http://localhost:8081/${bali.images[2]?.url}`}
              alt={bali.images[2]?.description}
              className="img-fluid rounded shadow-sm"
            />
          </div>
        </div>
      </section>
      <section className="container text-center my-5">
        <button
          onClick={handleBookNow}
          className="btn btn-primary btn-lg"
          style={{ width: "100%" }}
        >
          Book This Destination
        </button>
      </section>
      <footer className="bg-dark text-light py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 Home Haven Travels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dest2;
