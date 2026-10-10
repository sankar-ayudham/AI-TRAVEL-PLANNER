import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import {
  FaSun,
  FaMoon,
  FaUser,
  FaSignOutAlt,
  FaThLarge,
  FaCompass,
  FaBars,
  FaTimes,
  FaArrowRight,
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout, darkMode, toggleDarkMode } =
    useContext(AppContext);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [user]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`jp-navbar ${darkMode ? 'jp-navbar-dark' : ''}`}
    >
      <nav className="jp-navbar-inner" aria-label="Main navigation">
        <Link
          to="/"
          className="jp-brand"
          aria-label="JourneyPilot home"
          onClick={closeMenu}
        >
          <span className="jp-brand-icon">
            <FaCompass aria-hidden="true" />
          </span>

          <span className="jp-brand-word">
            journey<span>pilot</span><i>.</i>
          </span>
        </Link>

        <div className="jp-navbar-actions">
          {user && (
            <div className={`jp-nav-links ${menuOpen ? 'jp-nav-links-open' : ''}`}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `jp-nav-link ${isActive ? 'jp-nav-link-active' : ''}`
                }
                onClick={closeMenu}
              >
                <FaThLarge aria-hidden="true" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `jp-nav-link ${isActive ? 'jp-nav-link-active' : ''}`
                }
                onClick={closeMenu}
              >
                <FaUser aria-hidden="true" />
                <span>Profile</span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="jp-nav-link jp-logout"
              >
                <FaSignOutAlt aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {!user && (
            <div className="jp-auth-links">
              <Link
                to="/login"
                className="jp-login-link"
                onClick={closeMenu}
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="jp-signup-link"
                onClick={closeMenu}
              >
                Get started <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={toggleDarkMode}
            className="jp-theme-toggle"
            aria-label={
              darkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? (
              <FaSun aria-hidden="true" />
            ) : (
              <FaMoon aria-hidden="true" />
            )}
          </button>

          {user && (
            <button
              type="button"
              className="jp-mobile-menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="jp-navigation-links"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
      </nav>

      {user && (
        <div
          id="jp-navigation-links"
          className={`jp-mobile-nav ${menuOpen ? 'jp-mobile-nav-open' : ''}`}
        >
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `jp-mobile-nav-link ${isActive ? 'jp-mobile-nav-link-active' : ''}`
            }
            onClick={closeMenu}
          >
            <FaThLarge aria-hidden="true" />
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `jp-mobile-nav-link ${isActive ? 'jp-mobile-nav-link-active' : ''}`
            }
            onClick={closeMenu}
          >
            <FaUser aria-hidden="true" />
            Profile
          </NavLink>

          <button
            type="button"
            className="jp-mobile-nav-link jp-mobile-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
