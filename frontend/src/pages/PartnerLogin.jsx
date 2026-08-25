import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const PartnerLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

   const email = e.target.email.value;
   const password = e.target.password.value;

    try {
      const response = await axios.post('https://content-share-livid.vercel.app/api/auth/food-partner/login', {email, password}, {
        withCredentials: true}
      );

      console.log('Success:', response.data);
      navigate('/create-food');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" data-role="partner" onSubmit={handleSubmit}>
        <h2 className="auth-title">Sign in — Content Creator</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="business@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : 'Sign in'}
        </button>

        <div className="auth-links">
          <p className="muted">
            New to the platform?{' '}
            <Link to="/food-partner/register">Create Creator Account</Link>
          </p>

          <p className="muted switch-role">
            Want to Create Content?{' '}
            <Link to="/user/register">Register as User</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PartnerLogin;
