import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, DollarSign } from 'lucide-react'; // Only import icons used in the login form
import './css/Login.css'; // Import the custom CSS file for specific styling

const Login = () => { // Component name remains Login
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading for the login button

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear any previous errors
    setLoading(true); // Start loading state

    try {
      // Make the POST request to your login API
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      // Destructure response data
      const { token, role, name, photo } = res.data;

      // Store user details in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      localStorage.setItem('email', formData.email);
     localStorage.setItem('photo', photo || 'uploads/default.png');


      // Redirect user based on their role
      if (role === 'admin') {
        navigate('/admin-dashboard'); // Navigate to admin dashboard
      } else {
        navigate('/employee-dashboard'); // Navigate to employee dashboard
      }
    } catch (err) {
      // Handle login errors and display a user-friendly message
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Always stop loading state, regardless of success or failure
    }
  };

  return (
    // Main container for the login form, centering it on the screen
    // Uses Tailwind classes for min-height, flex layout to center content, background, font, and anti-aliasing
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-inter antialiased py-12 px-4 sm:px-6 lg:px-8">
      {/* Login Form Container */}
      <div className="login-card"> {/* Custom class from Login.css for styling */}
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Secure Client Login
        </h3>

        {/* Error Message Display */}
        {error && (
          <div className="error-message-box"> {/* Custom class for error messages */}
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input Group - uses custom CSS class `input-group` for centering */}
          <div className="input-group">
            <label htmlFor="email" className="input-label"> {/* Uses custom CSS class `input-label` */}
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              id="email"
              className="login-input" // Uses custom CSS class `login-input`
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@company.com"
            />
          </div>

          {/* Password Input Group - uses custom CSS class `input-group` for centering */}
          <div className="input-group">
            <label htmlFor="password" className="input-label"> {/* Uses custom CSS class `input-label` */}
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              id="password"
              className="login-input" // Uses custom CSS class `login-input`
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {/* Login Button - uses custom CSS class `login-button` */}
          <button
            type="submit"
            disabled={loading} // Button disabled when loading
            className="login-button"
          >
            {/* Loading spinner SVG (only visible when loading) */}
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Logging In...' : 'Login to Your Account'}
          </button>

          {/* Register Link */}
          <div className="text-center mt-6">
            <a
              href='/register'
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline transition-colors duration-200"
            >
              New user? Create an account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; // Exporting as Login