import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <h1 className="title">Welcome to FoodConnect</h1>
        <p className="subtitle">Choose your path to deliciousness</p>
        <div className="button-group">
          <button onClick={() => navigate('/user/register')} className="btn user-btn">
            Register as User
          </button>
          <button onClick={() => navigate('/food-partner/register')} className="btn partner-btn">
            Register as Food Partner
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
