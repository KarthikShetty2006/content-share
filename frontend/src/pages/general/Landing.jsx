import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">

        <h1 className="title">
          Welcome to Content Share
        </h1>

        <p className="subtitle">
          Explore, Create & Share Content
        </p>

        <div className="button-group">

          {/* Sign In */}
          <button
            onClick={() =>
              navigate('/food-partner/login')
            }
            className="btn user-btn"
          >
            Sign in as Creator
          </button>

          {/* Register */}
          <button
            onClick={() =>
              navigate('/food-partner/register')
            }
            className="btn partner-btn"
          >
            Create Creator Account
          </button>

        </div>

      </div>
    </div>
  );
};

export default LandingPage;