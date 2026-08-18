import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  LockKeyhole,
  User,
} from 'lucide-react';

import BrandSidebar from './components/brandsidebar';
import { registerUser } from '../services/authService';
import { saveAuth, seedProfileName } from '../utils/authState';
import { useTranslation } from '../utils/i18n/I18nContext';
import './signup_page.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Separate eye states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!form.name.trim()) {
      newErrors.name = t('Name is required.');
    }

    const value = form.email.trim();

    if (!value) {
      newErrors.email = t('Username or email is required.');
    } else {
      const isEmail = value.includes('@');
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (isEmail && !emailRegex.test(value)) {
        newErrors.email = t('Enter a valid email address.');
      }
    }

    if (!form.password.trim()) {
      newErrors.password = t('Password is required.');
    } else if (form.password.length < 8) {
      newErrors.password =
        t('Password must be at least 8 characters.');
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword =
        t('Confirm password is required.');
    } else if (
      form.confirmPassword !== form.password
    ) {
      newErrors.confirmPassword =
        t('Passwords do not match.');
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      saveAuth({ user, token: user.token });
      seedProfileName(user.name);
      navigate('/get-started');
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
          <h2>{t('Start Your Story')}</h2>

          <p>
            {t('Join us to start your journey in endless stories.')}
          </p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSignupSubmit}
        >

          {errors.form && (
            <p className="auth-error">
              {errors.form}
            </p>
          )}

          {/* NAME */}
          <label className="auth-field">

            <span>{t('Name')}</span>

            <div className="auth-input-wrap">

              <span
                className="auth-input-icon"
                aria-hidden="true"
              >
                <User size={18} />
              </span>

              <input
                type="text"
                name="name"
                placeholder={t('Enter your name')}
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />

            </div>

            {errors.name && (
              <p className="auth-error">
                {errors.name}
              </p>
            )}

          </label>


          {/* EMAIL */}
          <label className="auth-field">

            <span>{t('Email/Username')}</span>

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
                placeholder={t('Enter your email or username')}
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

            <span>{t('Password')}</span>

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
                placeholder={t('Enter your password')}
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
                    ? t('Hide password')
                    : t('Show password')
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

            <span>{t('Confirm Password')}</span>

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
                placeholder={t('Confirm your password')}
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
                    ? t('Hide confirm password')
                    : t('Show confirm password')
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
            disabled={submitting}
          >
            {submitting ? t('Signing up...') : t('Sign Up')}
          </button>


          {/* DIVIDER */}
          <div className="auth-divider">
            <span>{t('or')}</span>
          </div>


          {/* GOOGLE */}
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
              {t('Continue with Google')}
            </span>
          </button>

        </form>


        {/* FOOTER */}
        <p className="auth-footer">

          <span>
            {t('Already have an account?')}
          </span>

          {' '}

          <Link
            to="/"
            className="auth-text-link"
          >
            {t('Login')}
          </Link>

        </p>

      </section>

    </div>
  );
}