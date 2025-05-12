import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaSignInAlt } from 'react-icons/fa';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    success: '',
    error: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({
      loading: true,
      success: '',
      error: ''
    });

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);

      const response = await axios.post(
        "https://raymondotieno.pythonanywhere.com/api/signin", 
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.user) {
        setStatus({
          loading: false,
          success: 'Login successful! Redirecting...',
          error: ''
        });
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate("/");
      } else {
        setStatus({
          loading: false,
          success: '',
          error: response.data.message || 'Login failed'
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: '',
        error: error.response?.data?.message || 
              error.message || 
              'An error occurred during login'
      });
    }
  };

  return (
    <div className="container">
      <div className='row justify-content-center mt-5'>
        <div className='col-md-6 col-lg-5 p-4 card shadow'>
          <div className="text-center mb-4">
            <h2 className="text-primary">
              <FaSignInAlt className="me-2" />
              Sign In
            </h2>
            <p className="text-muted">Access your account to continue</p>
          </div>

          {status.error && (
            <div className="alert alert-danger" role="alert">
              {status.error}
            </div>
          )}

          {status.success && (
            <div className="alert alert-success" role="alert">
              {status.success}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                className='form-control' 
                required 
                onChange={handleChange} 
                value={formData.email}
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                id="password"
                name="password"
                className='form-control' 
                required 
                onChange={handleChange} 
                value={formData.password}
                placeholder="Enter your password"
              />
            </div>

            <button 
              className='btn btn-primary w-100' 
              type='submit'
              disabled={status.loading}
            >
              {status.loading ? (
                <>
                  <FaSpinner className="fa-spin me-2" />
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>

            <div className="mt-3 text-center">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="mt-4 text-center">
            Don't have an account? <Link to='/signup' className="text-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;