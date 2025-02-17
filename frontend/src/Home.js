// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/listDests")
      .then((response) => response.json())
      .then((data) => setDestinations(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleBookNow = async (destinationName) => {
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

      if (currentDestination && currentDestination !== destinationName) {
        const confirmChange = window.confirm(
          "Warning: Booking this destination will reset your current booking. Do you want to continue?"
        );

        if (!confirmChange) return;
      }

      await axios.post("http://localhost:8081/updateDestination", {
        username: loggedInUser,
        destination: destinationName,
        adultTickets: 0,
        childTickets: 0,
        startDate: null,
        endDate: null,
      });

      localStorage.setItem("selectedDestination", destinationName);
      localStorage.setItem("adultTickets", 0);
      localStorage.setItem("childTickets", 0);

      navigate("/ticketing");
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("Failed to book destination. Please try again.");
    }
  };

  return (
    <div>
      <section
        className="text-center bg-light py-5"
        style={{
          backgroundImage: "url('http://localhost:8081/images/CoverPhoto.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white",
        }}
      >
        <div
          className="container"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1 className="display-4">Explore the World's Most Beautiful Destinations</h1>
          <p className="lead">
            Home Haven Travels brings you a curated selection of the world's top travel spots. Whether you're looking for
            adventure, relaxation, or culture, our travel guide will help you discover the perfect destination for your
            next journey.
          </p>
        </div>
      </section>
      <section className="container py-5">
        <h2 className="text-center mb-4">Travel Destinations</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {destinations.map((destination, index) => (
            <div className="col" key={index}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`http://localhost:8081/images/${destination.CoverImage}`}
                  className="card-img-top"
                  alt={destination.name}
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {destination.name}, {destination.country}
                  </h5>
                  <p className="card-text">{destination.Coverdescription}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      onClick={() => navigate(`/dest${index + 1}`)}
                      className="btn btn-primary"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleBookNow(destination.name)}
                      className="btn btn-success"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-dark text-light py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 Home Haven Travels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
