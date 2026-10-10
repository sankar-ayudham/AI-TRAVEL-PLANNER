
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import {
  FaEnvelope,
  FaLock,
  FaCompass,
  FaArrowRight,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

export default function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'We couldn’t sign you in. Check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="jp-auth-page jp-login-page">
      <div className="jp-auth-shell">
        <section className="jp-auth-visual">
          <div className="jp-auth-photo" />

          <div className="jp-auth-visual-top">
            <span className="jp-auth-brand-mark"><FaCompass /></span>
            <span>THE WORLD IS WAITING</span>
          </div>

          <div className="jp-auth-visual-copy">
            <span className="jp-auth-kicker">
              YOUR NEXT CHAPTER
            </span>
            <h1>Somewhere<br />new is calling<span>.</span></h1>
            <p>
              Your saved journeys, your next destination,
              and all the little details that make a trip yours.
            </p>
          </div>

          <div className="jp-auth-photo-caption">
            <span className="jp-auth-caption-line" />
            <span>A different view changes everything.</span>
          </div>

          <span className="jp-auth-visual-number">01 — THE JOURNEY</span>
        </section>

        <section className="jp-auth-form-side">
          <div className="jp-auth-form-wrap">
            <div className="jp-auth-mobile-mark">
              <FaCompass />
              <span>journey<span>pilot</span>.</span>
            </div>

            <div className="jp-auth-heading">
              <span className="jp-auth-kicker">WELCOME BACK</span>
              <h2>Good to see<br /><em>you again.</em></h2>
              <p>Sign in to pick up where your next adventure begins.</p>
            </div>

            {error && (
              <div className="jp-auth-error" role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError('')}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <form className="jp-auth-form" onSubmit={handleSubmit}>
              <div className="jp-auth-field">
                <label htmlFor="login-email">Email address</label>
                <div className="jp-auth-input-wrap">
                  <FaEnvelope aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="jp-auth-field">
                <label htmlFor="login-password">Password</label>
                <div className="jp-auth-input-wrap">
                  <FaLock aria-hidden="true" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="jp-auth-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                className="jp-auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="jp-auth-spinner" />
                    Signing you in…
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <FaArrowRight />
                  </>
                )}
              </button>

              <p className="jp-auth-secure-note">
                <FaLock aria-hidden="true" />
                Your account details stay private.
              </p>
            </form>

            <div className="jp-auth-switch">
              <span>New to JourneyPilot?</span>
              <Link to="/register">
                Create an account <FaArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="jp-auth-footer">
              <span>JOURNEYPILOT</span>
              <span>MADE FOR THE JOURNEY</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
