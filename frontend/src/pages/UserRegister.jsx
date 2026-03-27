import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const UserRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullName=e.target.fullName.value;
    const email=e.target.email.value;
    const password=e.target.password.value;
    
    try {
      const response= await axios.post('http://localhost:3000/api/auth/user/register',{
        fullName,
        email,
        password 
       }, {
        withCredentials: true
       });
      // navigate('/user/dashboard');
      console.log('Registration successful:', response.data);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" data-role="user" onSubmit={handleSubmit}>
        <h2 className="auth-title">Create account — User</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
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
          {loading ? 'Loading...' : 'Create User Account'}
        </button>

        <div className="auth-links">
          <p className="muted">
            Already registered?{' '}
            <Link to="/user/login">Sign in as User</Link>
          </p>

          <p className="muted switch-role">
            Own a restaurant?{' '}
            <Link to="/food-partner/register">Register as Food Partner</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserRegister;
