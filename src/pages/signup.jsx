import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    branch: '',
    year: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateSignUp = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateSignUp()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:2120/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.firstName+" "+formData.lastName,
          email: formData.email,
          password: formData.password,
          EnrollmentNumber: formData.rollNumber,
          branch: formData.branch,
          year: formData.year
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Account created successfully! Redirecting to login...' });
        setTimeout(() => {
          setIsSignUp(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: formData.email,
            password: '',
            confirmPassword: '',
            rollNumber: '',
            branch: '',
            year: ''
          });
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateLogin()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:2120/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/Home')
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    :root {
      --bg-dark: #0f0f13;
      --bg-card: rgba(255, 255, 255, 0.05);
      --text-primary: #ffffff;
      --text-secondary: #b0b0b0;
      --accent-cyan: #4bcbfa;
      --accent-deep: #2575fc;
      --accent-gradient: linear-gradient(90deg, #4bcbfa 0%, #2575fc 100%);
      --glass-border: 1px solid rgba(75, 203, 250, 0.2);
      --blur-amount: 15px;
      --font-classy: 'Playfair Display', serif;
      --font-body: 'Poppins', sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-dark);
      color: var(--text-primary);
      overflow-x: hidden;
      min-height: 100vh;
    }

    .auth-background-blobs {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    .auth-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
    }

    .auth-blob-1 {
      top: -10%;
      left: -10%;
      width: 500px;
      height: 500px;
      background: rgba(75, 203, 250, 0.3);
      animation: float 8s ease-in-out infinite;
    }

    .auth-blob-2 {
      bottom: 10%;
      right: -5%;
      width: 400px;
      height: 400px;
      background: rgba(37, 117, 252, 0.25);
      animation: float 10s ease-in-out infinite reverse;
    }

    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 50px 40px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: var(--glass-border);
      border-radius: 20px;
      box-shadow: 0 0 50px rgba(75, 203, 250, 0.1);
      animation: slideUp 0.6s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .auth-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .auth-title {
      font-family: var(--font-classy);
      font-size: 2.5rem;
      margin-bottom: 10px;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .auth-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .form-row.full {
      grid-template-columns: 1fr;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    input, select {
      width: 100%;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(75, 203, 250, 0.3);
      border-radius: 10px;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--accent-cyan);
      background: rgba(75, 203, 250, 0.05);
      box-shadow: 0 0 20px rgba(75, 203, 250, 0.2);
    }

    input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    select {
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234bcbfa' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 20px;
      padding-right: 40px;
    }

    .password-field {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 15px;
      top: 42px;
      background: none;
      border: none;
      color: var(--accent-cyan);
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
      color: #ff6b6b;
      font-size: 0.85rem;
    }

    .message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      animation: slideDown 0.4s ease;
    }

    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .message.success {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .message.error {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      background: var(--accent-gradient);
      border: none;
      border-radius: 10px;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      box-shadow: 0 0 30px rgba(75, 203, 250, 0.4);
      transform: translateY(-2px);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .toggle-section {
      text-align: center;
      margin-top: 25px;
      padding-top: 25px;
      border-top: var(--glass-border);
    }

    .toggle-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: var(--accent-cyan);
      cursor: pointer;
      font-weight: 700;
      margin-left: 5px;
      transition: all 0.3s ease;
    }

    .toggle-btn:hover {
      text-shadow: 0 0 10px rgba(75, 203, 250, 0.5);
    }

    .back-button {
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(75, 203, 250, 0.1);
      border: 1px solid rgba(75, 203, 250, 0.3);
      color: var(--accent-cyan);
      padding: 10px 15px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.3s ease;
      z-index: 9999;
      font-family: var(--font-body);
    }

    .back-button:hover {
      background: rgba(75, 203, 250, 0.2);
      box-shadow: 0 0 20px rgba(75, 203, 250, 0.3);
      transform: translateX(-5px);
    }

    @media (max-width: 600px) {
      .auth-card {
        padding: 30px 20px;
        max-width: 100%;
      }

      .auth-title {
        font-size: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .auth-container {
        padding: 20px 10px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="auth-background-blobs">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
      </div>

      <button
        className="back-button"
        onClick={() =>  navigate('/')}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">{isSignUp ? 'Join Us' : 'Welcome Back'}</h1>
            <p className="auth-subtitle">
              {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              {message.text}
            </div>
          )}

          <div>
            {isSignUp && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <div className="error-message">
                        <AlertCircle size={14} />
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <div className="error-message">
                        <AlertCircle size={14} />
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@lnct.ac.in"
              />
              {errors.email && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group password-field">
              <label>Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <div className="error-message">
                  <AlertCircle size={14} />
                  {errors.password}
                </div>
              )}
            </div>

            {isSignUp && (
              <>
                <div className="form-group password-field">
                  <label>Confirm Password *</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.confirmPassword && (
                    <div className="error-message">
                      <AlertCircle size={14} />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                  />
                  {errors.rollNumber && (
                    <div className="error-message">
                      <AlertCircle size={14} />
                      {errors.rollNumber}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Branch *</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                      <option value="EE">EE</option>
                    </select>
                    {errors.branch && (
                      <div className="error-message">
                        <AlertCircle size={14} />
                        {errors.branch}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Year *</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </select>
                    {errors.year && (
                      <div className="error-message">
                        <AlertCircle size={14} />
                        {errors.year}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              className="submit-btn"
              disabled={loading}
              onClick={isSignUp ? handleSignUp : handleLogin}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </div>

          <div className="toggle-section">
            <span className="toggle-text">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              className="toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
                setMessage({ type: '', text: '' });
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  rollNumber: '',
                  branch: '',
                  year: ''
                });
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;