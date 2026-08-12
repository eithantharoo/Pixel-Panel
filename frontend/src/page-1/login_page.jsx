import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react';
import BrandSidebar from './components/brandsidebar';
import { loginUser } from '../services/authService';
import { saveAuth, seedProfileName } from '../utils/authState';
import './login_page.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (isEmail && !emailRegex.test(value)) {
        newErrors.email = 'Enter a valid email address.';
      }
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await loginUser({ email: form.email.trim(), password: form.password });
      saveAuth({ user, token: user.token });
      seedProfileName(user.name);
      navigate(user.interests?.length > 0 ? '/home' : '/get-started');
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: error.message }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">

      <BrandSidebar />

      <section className="auth-card">

        <header className="auth-card__header">
          <h2>Welcome Back</h2>

          <p>
            Continue your journey in endless stories.
          </p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleLoginSubmit}
        >

          {errors.form && (
            <p className="auth-error">
              {errors.form}
            </p>
          )}

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
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="auth-eye"
                onClick={() =>
                  setShowPassword((prev) => !prev)
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

          <div className="auth-row">
            <button
              type="button"
              className="auth-text-link"
              disabled
              title="Coming soon"
            >
              Forgot Password?
            </button>
          </div>

          <label className="auth-checkbox">

            <input
              type="checkbox"
              name="rememberMe"
            />

            <span>
              <strong>
                Remember Me
              </strong>

              <small>
                Keep me signed in on this device
              </small>
            </span>

          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="auth-google"
            disabled
            title="Coming soon"
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

        <p className="auth-footer">

          <span>
            Don&apos;t have an account?
          </span>

          <Link
            to="/signup"
            className="auth-text-link"
          >
            Sign Up
          </Link>

        </p>

      </section>

    </div>
  );
}