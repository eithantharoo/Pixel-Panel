import React, { useState } from 'react';//useNavigate from react-router-dom
import { Link, useNavigate } from 'react-router-dom';
import BrandSidebar from './components/brandsidebar';
import './login_page.css';

export default function LoginPage() {
  // 2. ADDED: Initialize the navigation hook
  const navigate = useNavigate();
  const [form, setForm] = useState({
  email: '',
  password: '',
});

const [errors, setErrors] = useState({});

const [showPassword, setShowPassword] = useState(false);

function handleChange(e) {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
}

  // 3. ADDED: Handle form submit to reach the get started page
  const handleLoginSubmit = (e) => {
  e.preventDefault();

  if (!validate()) return;

  navigate('/get-started');
};

  function validate() {
  const newErrors = {};

  const value = form.email.trim();

if (!value) {
  newErrors.email = "Username or email is required.";
} else {
  const isEmail = value.includes("@");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (isEmail && !emailRegex.test(value)) {
    newErrors.email = "Enter a valid email address.";
  }
}

  if (!form.password.trim()) {
  newErrors.password = "Password is required.";
} else if (form.password.length < 8) {
  newErrors.password = "Password must be at least 8 characters.";
}

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}

  return (
    <div className="auth-page">
      <BrandSidebar />

      <section className="auth-card">
        <header className="auth-card__header">
          <h2>Welcome Back</h2>
          <p>Continue your journey in endless stories.</p>
        </header>

        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <label className="auth-field">
            <span>Email/Username</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">👤</span>
              <input type="text" name="email" placeholder="Enter your email or username" 
              value={form.email}
              onChange={handleChange}/>
              {errors.email && (
                <p className="auth-error">{errors.email}</p>
              )}
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">🔒</span>
              <input type={showPassword ? "text" : "password"} name="password" 
              placeholder="Enter your password" value={form.password}
              onChange={handleChange} 
              />
              <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>👁</button>
              {errors.password && (
              <p className="auth-error">{errors.password}</p>
              )}
            </div>
          </label>

          <div className="auth-row">
            <button type="button" className="auth-text-link">Forgot Password?</button>
          </div>

          <label className="auth-checkbox">
            <input type="checkbox" name="rememberMe" />
            <span>
              <strong>Remember Me</strong>
              <small>Keep me signed in on this device</small>
            </span>
          </label>

          <button type="submit" className="auth-submit">Log In</button>

          <div className="auth-divider"><span>or</span></div>

          <button type="button" className="auth-google">
            <img src="/images/google_logo.png"
              alt=""
              className="auth-google__icon"
              aria-hidden="true"
            />
            Continue with Google
          </button>
        </form>

        {/* FIX: Replaced lowercase <link> with a capitalized <Link> component to target "/signup" */}
        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-text-link">Sign Up</Link>
        </p>
      </section>
    </div>
  );
}