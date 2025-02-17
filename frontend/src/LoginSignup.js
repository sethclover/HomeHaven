// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For signup only
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [message, setMessage] = useState(""); // For success/error messages
  const [isSuccess, setIsSuccess] = useState(false); // For successful login and signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSuccess(false);

    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const endpoint = isLogin ? "http://localhost:8081/login" : "http://localhost:8081/signup";

    try {
      const response = await axios.post(endpoint, { username, password });
      setMessage(response.data.message);
      if (isLogin && response.status === 200) {
        setIsSuccess(true);
        // Redirect to ticketing page after successful login
        localStorage.setItem("loggedInUser", username);
        window.location.href = "/";
      } else if (!isLogin && response.status === 201) {
        setIsSuccess(true);
        // Clear the form fields after successful signup
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setIsLogin(true); // Switch to login after successful signup
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 d-flex justify-content-center align-items-center">
        <img
          src="/favicon.ico"
          alt="favicon"
          style={{
            width: "30px",
            height: "30px",
            marginRight: "10px", // Adds spacing between the icon and text
          }}
        />
        Home Haven Travels
      </h2>
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h4 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h4>
        {message && (
          <div
            className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setIsSuccess(false);
            }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
