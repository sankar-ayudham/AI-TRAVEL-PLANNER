import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { FaRoute, FaRupeeSign, FaCalendarDay, FaUsers } from 'react-icons/fa';

export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background-light dark:bg-background-dark transition-colors duration-300">
      
      {/* Hero Value Statement */}
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          Take the Controls of Your Next Trip with <span className="text-blue-600 dark:text-blue-500">JourneyPilot</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Stop wasting hours copying blogs. Get a smart, route-optimized itinerary with precise local cost estimates tailored perfectly to your calendar and budget.
        </p>

        {/* Dynamic Context-Aware Action Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Enter Your Flight Deck
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Plan Your First Trip Free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 text-lg font-bold px-8 py-4 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Replaced Features Section: Explaining exactly what they get */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 dark:border-gray-800 w-full mt-auto bg-gray-50/50 dark:bg-gray-900/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Benefit 1: Route Optimization */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mb-4">
              <FaRoute className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Backtracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get an optimized transit track every morning showing you the most logical sequence to visit sights via local auto, walking, or metro paths.
            </p>
          </div>

          {/* Benefit 2: INR Itemized Costing */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-4">
              <FaRupeeSign className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Itemized INR Pricing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Know exactly how much money to carry with detailed price expectations for real sightseeing entry tickets and estimated day-by-day food allowances.
            </p>
          </div>

          {/* Benefit 3: Full Daily Breakdown Framework */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl mb-4">
              <FaCalendarDay className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Complete Blueprints</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive structured morning, afternoon, and evening breakdowns paired with targeted, budget-matched hotel stay recommendations.
            </p>
          </div>

          {/* Benefit 4: Group Scaling Multipliers */}
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl mb-4">
              <FaUsers className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Group Cost Scaling</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Whether traveling solo or piloting a group, the budget matrices automatically multiply baseline costs across your exact passenger count.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}