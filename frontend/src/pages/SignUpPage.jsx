import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, User } from 'lucide-react';
import BrandSidebar from '../components/auth/BrandSidebar';
import './SignUpPage.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      <BrandSidebar />

      <section className="auth-card">
        <header className="auth-card__header">
          <h2>Start Your Story</h2>
          <p>Enter endless worlds and begin your journey.</p>
        </header>

        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <label className="auth-field">
            <span>Email/Username</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true"><User size={18} /></span>
              <input type="text" name="email" placeholder="Enter your email or username" />
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true"><LockKeyhole size={18} /></span>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" />
              <button
                type="button"
                className="auth-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="auth-field">
            <span>Confirm Password</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true"><LockKeyhole size={18} /></span>
              <input type={showPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm your password" />
              <button
                type="button"
                className="auth-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button type="submit" className="auth-submit">Sign Up</button>

          <div className="auth-divider"><span>or</span></div>

          <button type="button" className="auth-google">
            <span className="auth-google__g" aria-hidden="true">G</span>
            Continue with Google
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <button type="button" className="auth-text-link" onClick={() => navigate('/')}>
            Log In
          </button>
        </p>
      </section>
    </div>
  );
}
