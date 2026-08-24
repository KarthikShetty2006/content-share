// ...existing code...
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = ({ type = 'login', role = 'user' }) => {
  const isRegister = type === 'register';
  const isUser = role === 'user';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const endpoint = isRegister 
        ? (isUser ? '/api/auth/register/user' : '/api/auth/register/partner')
        : (isUser ? '/api/auth/login/user' : '/api/auth/login/partner');

      const response = await axios.post(endpoint, data);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Handle success (redirect, show message, etc.)
      console.log('Success:', response.data);
      // You can add navigation here, e.g., navigate('/dashboard')
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        data-role={isUser ? 'user' : 'partner'}
        data-type={type}
        aria-label={`${role} ${type} form`}
        onSubmit={handleSubmit}
      >
        <h2 className="auth-title">
          {isRegister ? 'Create account' : 'Sign in'} — {isUser ? 'User' : 'Food Partner'}
        </h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">{isUser ? 'Full Name' : 'Business Name'}</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={isUser ? 'Your full name' : 'Enter name'}
              required
            />
          </div>
        )}

        {/* Partner-specific extra fields on register */}
        {isRegister && !isUser && (
          <>
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
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={isUser ? 'you@example.com' : 'business@example.com'}
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
          {loading 
            ? 'Loading...'
            : isRegister 
              ? (isUser ? 'Create User Account' : 'Register Restaurant') 
              : 'Sign in'}
        </button>

        <div className="auth-links">
          <p className="muted">
            {isRegister ? (
              <>
                Already registered?{' '}
                <Link to={isUser ? '/user/login' : '/food-partner/login'}>
                  Sign in {isUser ? 'as User' : 'as Partner'}
                </Link>
              </>
            ) : (
              <>
                New to the platform?{' '}
                <Link to={isUser ? '/user/register' : '/food-partner/register'}>
                  Create {isUser ? 'User Account' : 'Partner Account'}
                </Link>
              </>
            )}
          </p>

          <p className="muted switch-role">
            {isUser ? (
              <>
                Have a Content?{' '}
                <Link to="/food-partner/register">Register as Creator</Link>
              </>
            ) : (
              <>
                Want the Video?{' '}
                <Link to="/user/register">Register as User</Link>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
// ...existing code...