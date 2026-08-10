import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  LockKeyhole,
  User,
} from 'lucide-react';

import BrandSidebar from './components/brandsidebar';
import './signup_page.css';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Separate eye states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  }

  function validate() {
    const newErrors = {};

    const value = form.email.trim();

    if (!value) {
      newErrors.email = 'Username or email is required.';
    } else {
      const isEmail = value.includes('@');
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (isEmail && !emailRegex.test(value)) {
        newErrors.email = 'Enter a valid email address.';
      }
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      newErrors.password =
        'Password must be at least 8 characters.';
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword =
        'Confirm password is required.';
    } else if (
      form.confirmPassword !== form.password
    ) {
      newErrors.confirmPassword =
        'Passwords do not match.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSignupSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    navigate('/get-started');
  }

  return (
    <div className="auth-page">

      <BrandSidebar />

      <section className="auth-card">

        <header className="auth-card__header">
          <h2>Start Your Story</h2>

          <p>
            Join us to start your journey in endless stories.
          </p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSignupSubmit}
        >

          {/* EMAIL */}
          <label className="auth-field">

            <span>Email/Username</span>

            <div className="auth-input-wrap">

              <span
                className="auth-input-icon"
                aria-hidden="true"
              >
                <User size={18} />
              </span>

              <input
                type="text"
                name="email"
                placeholder="Enter your email or username"
                value={form.email}
                onChange={handleChange}
                autoComplete="username"
              />

            </div>

            {errors.email && (
              <p className="auth-error">
                {errors.email}
              </p>
            )}

          </label>


          {/* PASSWORD */}
          <label className="auth-field">

            <span>Password</span>

            <div className="auth-input-wrap">

              <span
                className="auth-input-icon"
                aria-hidden="true"
              >
                <LockKeyhole size={18} />
              </span>

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="auth-eye"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="auth-error">
                {errors.password}
              </p>
            )}

          </label>


          {/* CONFIRM PASSWORD */}
          <label className="auth-field">

            <span>Confirm Password</span>

            <div className="auth-input-wrap">

              <span
                className="auth-input-icon"
                aria-hidden="true"
              >
                <LockKeyhole size={18} />
              </span>

              <input
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="auth-eye"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {errors.confirmPassword && (
              <p className="auth-error">
                {errors.confirmPassword}
              </p>
            )}

          </label>


          {/* SIGN UP */}
          <button
            type="submit"
            className="auth-submit"
          >
            Sign Up
          </button>


          {/* DIVIDER */}
          <div className="auth-divider">
            <span>or</span>
          </div>


          {/* GOOGLE */}
          <button
            type="button"
            className="auth-google"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="auth-google__icon"
            />

            <span>
              Continue with Google
            </span>
          </button>

        </form>


        {/* FOOTER */}
        <p className="auth-footer">

          <span>
            Already have an account?
          </span>

          {' '}

          <Link
            to="/"
            className="auth-text-link"
          >
            Login
          </Link>

        </p>

      </section>

    </div>
  );
}