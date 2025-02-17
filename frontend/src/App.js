// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Ticketing from "./Ticketing";
import Dest1 from "./Dest1";
import Dest2 from "./Dest2";
import Dest3 from "./Dest3";
import About from "./About";
import LoginSignup from "./LoginSignup";
import Navbar from "./Navbar";
import Receipt from "./Receipt";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("loggedInUser"));

  return (
    <Router>
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        {/* Redirect to login if not logged in */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<LoginSignup setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={isLoggedIn ? <About /> : <Navigate to="/login" />}
        />
        <Route
          path="/ticketing"
          element={isLoggedIn ? <Ticketing /> : <Navigate to="/login" />}
        />
        <Route
          path="/dest1"
          element={isLoggedIn ? <Dest1 /> : <Navigate to="/login" />}
        />
        <Route
          path="/dest2"
          element={isLoggedIn ? <Dest2 /> : <Navigate to="/login" />}
        />
        <Route
          path="/dest3"
          element={isLoggedIn ? <Dest3 /> : <Navigate to="/login" />}
        />
        <Route
          path="/receipt"
          element={isLoggedIn ? <Receipt /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
