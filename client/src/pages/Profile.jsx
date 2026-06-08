import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';

export default function Profile() {
  const { user } = useContext(AppContext);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Account Settings</h1>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-primary"></div>
          <div className="p-8 relative pt-0">
            <div className="absolute -top-12 left-8 bg-white dark:bg-gray-800 rounded-full p-1 border-4 border-white dark:border-gray-800 shadow-sm">
              <FaUserCircle className="text-8xl text-gray-400 dark:text-gray-500" />
            </div>
            <div className="h-16"></div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Personal Travel Member</p>
            </div>
            <hr className="border-gray-100 dark:border-gray-700/60 my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <div className="text-primary mt-1"><FaUserCircle className="text-lg" /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Full Name</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{user.name}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <div className="text-primary mt-1"><FaEnvelope className="text-lg" /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email Address</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <div className="text-primary mt-1"><FaCalendarAlt className="text-lg" /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Member Since</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{joinDate}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <div className="text-primary mt-1"><FaShieldAlt className="text-lg" /></div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Security Tier</p>
                  <p className="text-base font-medium text-green-600 dark:text-green-400 mt-0.5">Verified JWT Secured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}