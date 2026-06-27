import BrandSidebar from './components/brandsidebar';
import './login_page.css';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <BrandSidebar />

      <section className="auth-card">
        <header className="auth-card__header">
          <h2>Welcome Back</h2>
          <p>Continue your journey in endless stories.</p>
        </header>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <label className="auth-field">
            <span>Email/Username</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">👤</span>
              <input type="text" name="email" placeholder="Enter your email or username" />
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">🔒</span>
              <input type="password" name="password" placeholder="Enter your password" />
              <button type="button" className="auth-eye" aria-label="Show password">👁</button>
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
            <span className="auth-google__g" aria-hidden="true">G</span>
            Continue with Google
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <button type="button" className="auth-text-link">Sign Up</button>
        </p>
      </section>
    </div>
  );
}