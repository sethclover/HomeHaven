// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Ticketing = () => {
  const [destination, setDestination] = useState(null);
  const [adultTickets, setAdultTickets] = useState(0);
  const [childTickets, setChildTickets] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cvv: "",
    expirationDate: "",
  });
  const [addressInfo, setAddressInfo] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const adultPrice = 200;
  const childPrice = 150;
  const taxRate = 0.1;
  const navigate = useNavigate();

  // Calculate subtotal and total
  const subtotal = adultTickets * adultPrice + childTickets * childPrice;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        try {
          const response = await axios.get("http://localhost:8081/user", {
            params: { username: loggedInUser },
          });
          const data = response.data;
          setDestination(data.destination || null);
          setAdultTickets(data.adultTickets || 0);
          setChildTickets(data.childTickets || 0);
          setStartDate(data.startDate || "");
          setEndDate(data.endDate || "");
          setPersonalInfo(
            data.personalInfo || { name: "", email: "", phone: "" }
          );
          setCardInfo(
            data.cardInfo || { cardNumber: "", cvv: "", expirationDate: "" }
          );
          setAddressInfo(
            data.addressInfo || { street: "", city: "", state: "", zip: "" }
          );
        } catch (error) {
          console.error("Error fetching user data:", error);
          setDestination(null);
        }
      }
    };
    fetchUserData();
  }, []);

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    const zipRegex = /^\d{5}$/;
    const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    const cvvRegex = /^\d{3,4}$/;
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
    if (adultTickets === 0 && childTickets === 0) {
      errors.tickets = "Please add at least one ticket.";
    }
  
    if (!personalInfo.name || !personalInfo.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!personalInfo.email || !personalInfo.email.trim()) {
      errors.email = "Email is required.";
    }
    if (!personalInfo.phone || !phoneRegex.test(personalInfo.phone)) {
      errors.phone = "Phone number must follow the format (xxx) xxx-xxxx.";
    }
    if (!addressInfo.street || !addressInfo.street.trim()) {
      errors.street = "Street address is required.";
    }
    if (!addressInfo.city || !addressInfo.city.trim()) {
      errors.city = "City is required.";
    }
    if (!addressInfo.state || !addressInfo.state.trim()) {
      errors.state = "State is required.";
    }
    if (!addressInfo.zip || !zipRegex.test(addressInfo.zip)) {
      errors.zip = "Zip code must be 5 digits.";
    }
  
    if (!startDate || !startDate.trim()) {
      errors.startDate = "Start date is required.";
    }
    if (!endDate || !endDate.trim()) {
      errors.endDate = "End date is required.";
    } else if (new Date(endDate) < new Date(startDate)) {
      errors.endDate = "End date must not be earlier than start date.";
    }
  
    setFormErrors(errors);
  
    if (Object.keys(errors).length > 0) {
      // Scroll to the top if there are errors
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  
    return Object.keys(errors).length === 0;
  };  

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowWarning(true);
      return;
    }

    const loggedInUser = localStorage.getItem("loggedInUser");
    try {
      await axios.post("http://localhost:8081/updateDestination", {
        username: loggedInUser,
        destination,
        adultTickets,
        childTickets,
        startDate,
        endDate,
        total,
      });
      navigate("/receipt", {
        state: {
          destination,
          startDate,
          endDate,
          adultTickets,
          childTickets,
          total,
          personalInfo,
          cardInfo,
          addressInfo,
        },
      });
    } catch (error) {
      console.error("Error confirming purchase:", error);
    }
  };

  if (!destination) {
    return (
      <div className="container my-5 text-center">
        <h1 className="display-4 text-danger">Pick a Destination</h1>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {showWarning && Object.keys(formErrors).length > 0 && (
        <div className="alert alert-danger">
          <ul>
            {Object.values(formErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <h2 className="text-center mb-4">
        Your Booking for <strong>{destination}</strong>
      </h2>
      <form onSubmit={handleConfirmPurchase}>
        {/* Tickets Section */}
        <div className="mb-4">
          <h4>Tickets</h4>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p>Adult Tickets</p>
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setAdultTickets((prev) => Math.max(0, prev - 1))}
              >
                -
              </button>
              <span className="mx-3">{adultTickets}</span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setAdultTickets((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <p>${(adultTickets * adultPrice).toFixed(2)}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p>Child Tickets</p>
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setChildTickets((prev) => Math.max(0, prev - 1))}
              >
                -
              </button>
              <span className="mx-3">{childTickets}</span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setChildTickets((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <p>${(childTickets * childPrice).toFixed(2)}</p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-4">
          <h4>Summary</h4>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <h5>Total: ${total.toFixed(2)}</h5>
        </div>

        {/* Dates Section */}
        <div className="mb-4">
          <h4>Dates</h4>
          <div className="d-flex">
            <div style={{ marginRight: "10px" }}>
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mb-4">
          <h4>Personal Information</h4>
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            value={personalInfo.name}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={personalInfo.email}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, email: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone (xxx) xxx-xxxx"
            className="form-control"
            value={personalInfo.phone}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, phone: e.target.value })
            }
          />
        </div>

        {/* Address Information Section */}
        <div className="mb-4">
          <h4>Address Information</h4>
          <input
            type="text"
            placeholder="Street"
            className="form-control"
            value={addressInfo.street}
            onChange={(e) =>
              setAddressInfo({ ...addressInfo, street: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            className="form-control"
            value={addressInfo.city}
            onChange={(e) =>
              setAddressInfo({ ...addressInfo, city: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            className="form-control"
            value={addressInfo.state}
            onChange={(e) =>
              setAddressInfo({ ...addressInfo, state: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Zip"
            className="form-control"
            value={addressInfo.zip}
            onChange={(e) =>
              setAddressInfo({ ...addressInfo, zip: e.target.value })
            }
          />
        </div>

        {/* Card Information Section */}
        <div className="mb-4">
          <h4>Card Information</h4>
          <input
            type="text"
            placeholder="Card Number (xxxx-xxxx-xxxx-xxxx)"
            className="form-control"
            value={cardInfo.cardNumber}
            onChange={(e) =>
              setCardInfo((prev) => ({ ...prev, cardNumber: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="CVV (3 or 4 digits)"
            className="form-control"
            value={cardInfo.cvv}
            onChange={(e) =>
              setCardInfo((prev) => ({ ...prev, cvv: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Expiration Date (MM/YY)"
            className="form-control"
            value={cardInfo.expirationDate}
            onChange={(e) =>
              setCardInfo((prev) => ({
                ...prev,
                expirationDate: e.target.value,
              }))
            }
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            Confirm Your Purchase
          </button>
        </div>
      </form>
    </div>
  );
};

export default Ticketing;
