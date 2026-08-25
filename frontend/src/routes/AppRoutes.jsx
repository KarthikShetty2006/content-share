import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import PartnerRegister from "../pages/PartnerRegister";
import PartnerLogin from "../pages/PartnerLogin";

import Home from "../pages/general/Home";
import SavedVideos from "../pages/general/SavedVideos.jsx";
import LandingPage from "../pages/general/Landing.jsx";

import CreateFood from "../pages/FoodPartner/CreateFood.jsx";
import MyProfile from "../pages/general/MyProfile.jsx";
import CreatorProfile from "../pages/FoodPartner/CreatorProfile.jsx";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* Landing */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Authentication */}
        <Route
          path="/food-partner/register"
          element={<PartnerRegister />}
        />

        <Route
          path="/food-partner/login"
          element={<PartnerLogin />}
        />

        {/* Main Application */}
        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/create-food"
          element={<CreateFood />}
        />

        <Route
          path="/saved"
          element={<SavedVideos />}
        />

        {/* Logged-in Creator Profile */}
        <Route
          path="/profile"
          element={<MyProfile />}
        />

        {/* View Creator */}
        <Route
          path="/food-partner/:id"
          element={<CreatorProfile />}
        />

      </Routes>
    </Router>
  );
};