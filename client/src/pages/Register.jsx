import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCompass,
  FaArrowRight,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

export default function Register() {
  const { register } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="jp-auth-page jp-register-page">
      <section className="jp-auth-shell">
        <div className="jp-auth-visual">
          <img
            className="jp-auth-photo"
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85"
            alt="A peaceful mountain lake surrounded by dramatic landscapes"
          />

          <div className="jp-auth-visual-overlay" />

          <Link to="/" className="jp-auth-brand">
            <span className="jp-auth-brand-icon">
              <FaCompass />
            </span>
            <span>JourneyPilot</span>
          </Link>

          <div className="jp-auth-visual-copy">
            <span className="jp-auth-eyebrow">
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h1>
              The world
              <br />
              is waiting
              <br />
              <em>for you.</em>
            </h1>

            <p>
              Create your account and turn the places you've
              dreamed about into journeys you'll remember.
            </p>

            <div className="jp-auth-photo-caption">
              <span className="jp-auth-caption-line" />
              YOUR JOURNEY, YOUR WAY
            </div>
          </div>
        </div>

        <div className="jp-auth-form-side">
          <div className="jp-auth-form-wrap">
            <Link to="/" className="jp-auth-mobile-brand">
              <FaCompass />
              <span>JourneyPilot</span>
            </Link>

            <div className="jp-auth-heading">
              <span className="jp-auth-kicker">
                BEGIN YOUR ADVENTURE
              </span>

              <h2>Create your account.</h2>

              <p>
                A few details, and your next adventure is one
                step closer.
              </p>
            </div>

            {error && (
              <div className="jp-auth-error" role="alert">
                {error}
              </div>
            )}

            <form
              className="jp-auth-form"
              onSubmit={handleSubmit}
            >
              <div className="jp-auth-field">
                <label htmlFor="register-name">Full name</label>

                <div className="jp-auth-input-wrap">
                  <FaUser className="jp-auth-input-icon" />

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="jp-auth-field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="jp-auth-input-wrap">
                  <FaEnvelope className="jp-auth-input-icon" />

                  <input
                    id="register-email"
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
                <label htmlFor="register-password">Password</label>

                <div className="jp-auth-input-wrap">
                  <FaLock className="jp-auth-input-icon" />

                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="jp-auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    aria-pressed={showPassword}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="jp-auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="jp-auth-spinner" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create account
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="jp-auth-switch">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>

            <div className="jp-auth-footer">
              <span>MADE FOR THE JOURNEY</span>
              <span>NOT JUST THE DESTINATION</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
