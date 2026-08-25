import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const PartnerRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const name=e.target.name.value;
    const contactName=e.target.contactName.value;
    const phone=e.target.phone.value;
    const address=e.target.address.value;
    const email=e.target.email.value;
    const password=e.target.password.value;

    try {
      const response = await axios.post('https://content-share-livid.vercel.app/api/auth/food-partner/register', {
        name,
        contactName,
        phone,
        address,
        email,
        password
      }, {
        withCredentials: true
      });

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
        <h2 className="auth-title">Create account — Creator</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Creator Account Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Restaurant / Cloud kitchen name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactName">Contact Person</label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            placeholder="Contact person's full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            placeholder="Street, area, city, postal code"
            required
          />
        </div>

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
          {loading ? 'Loading...' : 'Register Creator Account'}
        </button>

        <div className="auth-links">
          <p className="muted">
            Already registered?{' '}
            <Link to="/food-partner/login">Sign in as Creator</Link>
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

export default PartnerRegister;