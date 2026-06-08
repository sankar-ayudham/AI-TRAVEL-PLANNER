import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { FaSun, FaMoon, FaUser, FaSignOutAlt, FaThLarge } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout, darkMode, toggleDarkMode } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex justify-between h-16 items-center">
          
          {/* JourneyPilot Custom Logo Lockup */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              {/* Custom SVG: Minimalist Aviation HUD / Navigation Tracking Pointer */}
              <svg 
                className="h-7 w-7 text-blue-600 dark:text-blue-500 transition-transform group-hover:rotate-12 duration-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                Journey<span className="text-blue-600 dark:text-blue-500">Pilot</span>
              </span>
            </Link>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center space-x-4">
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FaSun className="text-xl text-yellow-400" /> : <FaMoon className="text-xl" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <FaThLarge className="text-xs" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <FaUser className="text-xs" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}