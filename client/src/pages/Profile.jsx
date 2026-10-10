import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import {
  FaUserCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaCompass,
  FaArrowRight,
} from 'react-icons/fa';

export default function Profile() {
  const { user } = useContext(AppContext);

  if (!user) {
    return (
      <main className="jp-profile-loading">
        <div
          className="jp-profile-spinner"
          role="status"
          aria-label="Loading profile"
        />
        <p>Preparing your travel journal...</p>
      </main>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  const initials = (user.name || 'Traveler')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="jp-profile-page">
      <div className="jp-profile-container">
        <div className="jp-profile-breadcrumb">
          <Link to="/dashboard">My journeys</Link>
          <span>/</span>
          <span>Account</span>
        </div>

        <header className="jp-profile-heading">
          <span className="jp-profile-eyebrow">
            YOUR TRAVEL IDENTITY
          </span>
          <h1>Account settings.</h1>
          <p>
            The details behind every journey you plan with JourneyPilot.
          </p>
        </header>

        <section className="jp-profile-card">
          <div className="jp-profile-cover">
            <div className="jp-profile-cover-mark">
              <FaCompass />
              <span>JOURNEYPILOT TRAVEL JOURNAL</span>
            </div>
            <div className="jp-profile-cover-decoration" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="jp-profile-content">
            <div className="jp-profile-identity">
              <div className="jp-profile-avatar" aria-label={`Avatar for ${user.name || 'traveler'}`}>
                {initials || <FaUserCircle />}
              </div>

              <div className="jp-profile-identity-copy">
                <span className="jp-profile-member-label">
                  YOUR ACCOUNT
                </span>
                <h2>{user.name || 'Traveler'}</h2>
                <p>{user.email}</p>
              </div>

              <span className="jp-profile-status">
                <span />
                Active member
              </span>
            </div>

            <div className="jp-profile-divider" />

            <div className="jp-profile-section-heading">
              <div>
                <span className="jp-profile-eyebrow">ACCOUNT DETAILS</span>
                <h3>Your information</h3>
              </div>
              <p>Your registered account details.</p>
            </div>

            <div className="jp-profile-details">
              <div className="jp-profile-detail">
                <div className="jp-profile-detail-icon">
                  <FaUserCircle />
                </div>
                <div className="jp-profile-detail-copy">
                  <span>Full name</span>
                  <strong>{user.name || 'Not provided'}</strong>
                </div>
              </div>

              <div className="jp-profile-detail">
                <div className="jp-profile-detail-icon">
                  <FaEnvelope />
                </div>
                <div className="jp-profile-detail-copy">
                  <span>Email address</span>
                  <strong className="jp-profile-email">
                    {user.email || 'Not provided'}
                  </strong>
                </div>
              </div>

              <div className="jp-profile-detail">
                <div className="jp-profile-detail-icon">
                  <FaCalendarAlt />
                </div>
                <div className="jp-profile-detail-copy">
                  <span>Member since</span>
                  <strong>{joinDate}</strong>
                </div>
              </div>

              <div className="jp-profile-detail">
                <div className="jp-profile-detail-icon">
                  <FaShieldAlt />
                </div>
                <div className="jp-profile-detail-copy">
                  <span>Account security</span>
                  <strong className="jp-profile-security">
                    Authenticated account
                  </strong>
                </div>
              </div>
            </div>

            <div className="jp-profile-note">
              <div className="jp-profile-note-icon">
                <FaCompass />
              </div>
              <div>
                <h3>There's a world out there.</h3>
                <p>
                  Your next adventure is waiting. Pick a destination
                  and let JourneyPilot help plan the way.
                </p>
              </div>
              <Link to="/dashboard" aria-label="Plan your next trip">
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <p className="jp-profile-footer">
          JOURNEYPILOT <span>·</span> YOUR JOURNEY, YOUR WAY
        </p>
      </div>
    </main>
  );
}
