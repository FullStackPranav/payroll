import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Camera, Eye, EyeOff } from 'lucide-react'; // Include Eye and EyeOff icons
import './css/Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (photo) {
      data.append('photo', photo);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center font-inter antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="register-card">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Create Your Account
        </h2>

        {error && (
          <div className="error-message-box">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="input-group">
            <label htmlFor="name" className="input-label">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              id="name"
              className="register-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              id="email"
              className="register-input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="input-group relative">
            <label htmlFor="password" className="input-label">
              <Lock size={16} /> Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="register-input pr-10"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute top-9 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="photo" className="input-label">
              <Camera size={16} /> Profile Photo (optional)
            </label>
            <input
              type="file"
              id="photo"
              className="register-input file-input"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="register-button"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Registering...' : 'Register Account'}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-700 text-sm font-medium">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
