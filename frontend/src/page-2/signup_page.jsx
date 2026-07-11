import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react';
import BrandSidebar from './components/brandsidebar';
import './signup_page.css'; // Reusing your beautiful auth styles

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const [errors, setErrors] = useState({});

const [showPassword, setShowPassword] = useState(false);

function handleChange(e) {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
}
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

  if (!form.confirmPassword.trim()) {
    newErrors.confirmPassword = "Password is required.";
  }
  else if (form.confirmPassword !== form.password) {
    newErrors.confirmPassword =
      "Passwords do not match.";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
}

  // Handle account creation and redirect to get-started
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // You can add registration or validation checks here later
    navigate('/get-started'); 
  };

  return (
    <div className="auth-page">
      <BrandSidebar />

      <section className="auth-card">
        <header className="auth-card__header">
          <h2>Start Your Story</h2>
          <p>Join us to start your journey in endless stories.</p>
        </header>

        <form className="auth-form" onSubmit={handleSignupSubmit}>
          <label className="auth-field">
            <span>Email/Username</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true"><User size={18} /></span>
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
              <span className="auth-input-icon" aria-hidden="true"><LockKeyhole size={18} /></span>
             <input type={showPassword ? "text" : "password"} name="password" 
              placeholder="Enter your password" value={form.password}
              onChange={handleChange} 
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
              <p className="auth-error">{errors.password}</p>
              )}
            </div>
          </label>

          <label className="auth-field">
            <span>Confirm Password</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true"><LockKeyhole size={18} /></span>
              <input type={showPassword ? "text" : "password"} name="confirmPassword" 
              placeholder="Confirm your password" value={form.confirmPassword}
              onChange={handleChange} 
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPassword && (
              <p className="auth-error">{errors.confirmPassword}</p>
              )}
            </div>
          </label>

          <button type="submit" className="auth-submit">Sign Up</button>

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

        {/* Links smoothly back to your root Login page */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/" className="auth-text-link">Login</Link>
        </p>
      </section>
    </div>
  );
}
