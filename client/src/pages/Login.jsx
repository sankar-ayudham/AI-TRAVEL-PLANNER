import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { FaEnvelope, FaLock, FaPlane } from 'react-icons/fa';

export default function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background-light dark:bg-background-dark px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50">
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full mb-3">
            <FaPlane className="transform -rotate-45 text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to access your customized AI travel itineraries</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><FaEnvelope /></span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><FaLock /></span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Create an Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}