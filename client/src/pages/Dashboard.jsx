import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import API from '../api';
import { 
  FaPlane, FaCalendarAlt, FaDollarSign, FaUsers, FaTrash, 
  FaPlus, FaSave, FaSpinner, FaSuitcase, FaMapMarkerAlt, FaRoute, FaCheckCircle, FaPiggyBank
} from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useContext(AppContext);

  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'Moderate',
    travelers: 1,
  });
  
  const [generating, setGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { destination, startDate, endDate, budget, travelers } = formData;

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      const res = await API.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to pull saved itineraries from the server.');
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateTrip = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setGeneratedItinerary(null);

    if (!destination.trim() || !startDate || !endDate) {
      setError('Please provide a destination along with start and end dates.');
      return;
    }

    try {
      setGenerating(true);
      const res = await API.post('/trips/generate', formData);
      setGeneratedItinerary(res.data);
      setSuccessMsg('Itinerary successfully mapped with route itemization!');
    } catch (err) {
      console.error('Generation failure:', err);
      setError('Generative engine currently congested. Please tap generate again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!generatedItinerary) return;
    setError('');
    setSuccessMsg('');

    try {
      const payload = { ...formData, itineraryData: generatedItinerary };
      const res = await API.post('/trips', payload);
      setTrips([res.data, ...trips]);
      setGeneratedItinerary(null);
      setFormData({ destination: '', startDate: '', endDate: '', budget: 'Moderate', travelers: 1 });
      setSuccessMsg('Trip saved successfully to your cloud dashboard!');
    } catch (err) {
      setError('Could not save this trip.');
    }
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you absolutely sure you want to permanently delete this itinerary?')) return;
    setError('');

    try {
      await API.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t._id !== id));
      if (selectedTrip?._id === id) setSelectedTrip(null);
      setSuccessMsg('Itinerary deleted.');
    } catch (err) {
      setError('Failed to delete itinerary.');
    }
  };

  // Reusable sub-component layout to display the itinerary layout cleanly
  const renderItineraryDetails = (data) => {
    return (
      <div className="space-y-6 mt-4">
        <p className="text-gray-600 dark:text-gray-300 italic text-sm font-medium">"{data.summary}"</p>

        {/* Cost Estimation Matrix Table */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-1.5">
            <FaDollarSign className="text-primary" /> Budget Estimate (Per Person)
          </h4>
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold">
                <tr>
                  <th className="px-4 py-2.5">Expense Segment</th>
                  <th className="px-4 py-2.5">Budget (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/40">
                <tr><td className="px-4 py-2.5 font-medium">Intercity Travel (Bus/Train/Flight)</td><td className="px-4 py-2.5">{data.budgetBreakdownTable?.intercityTravel || '₹1,500 - ₹3,000'}</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Hotel Accommodation</td><td className="px-4 py-2.5">{data.budgetBreakdownTable?.hotelStay || '₹2,000 - ₹4,000'}</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Food & Dining Daily Coverage</td><td className="px-4 py-2.5">{data.budgetBreakdownTable?.foodAndDining || '₹1,000 - ₹2,000'}</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Local Sightseeing Transport</td><td className="px-4 py-2.5">{data.budgetBreakdownTable?.localSightseeingTransport || '₹1,200 - ₹2,500'}</td></tr>
                <tr><td className="px-4 py-2.5 font-medium">Attraction Entry Tickets</td><td className="px-4 py-2.5">{data.budgetBreakdownTable?.entryTickets || '₹300 - ₹800'}</td></tr>
                <tr className="bg-blue-50/40 dark:bg-blue-900/20 font-bold text-gray-900 dark:text-white">
                  <td className="px-4 py-2.5">Projected Grand Total</td>
                  <td className="px-4 py-2.5 text-primary">{data.budgetBreakdownTable?.grandTotalRange || data.estimatedTotalCost}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Day-by-Day Route Itinerary Layout */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
            <FaRoute className="text-primary" /> Daily Schedule Framework & Transit Tracks
          </h4>
          {data.dailyItinerary?.map((dayObj, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700/60 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <h5 className="font-bold text-primary text-sm">Day {dayObj.day} – {dayObj.dayFocus || 'Sightseeing'}</h5>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-primary font-bold px-2 py-0.5 rounded-md">Cost: {dayObj.dayCostRange || 'Variable'}</span>
              </div>

              {dayObj.optimizedRoute && (
                <div className="text-xs bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaRoute className="text-red-400 shrink-0" />
                  <p><span className="font-bold text-gray-900 dark:text-white">Optimized Track:</span> {dayObj.optimizedRoute}</p>
                </div>
              )}

              <div className="space-y-3 my-2">
                {dayObj.activities?.map((act, actIdx) => (
                  <div key={actIdx} className="pl-3 border-l-2 border-primary/40 space-y-0.5">
                    <div className="flex justify-between items-start text-xs">
                      <p className="font-bold text-gray-900 dark:text-white">{act.time} ➔ {act.title}</p>
                      <span className="text-green-600 dark:text-green-400 font-semibold shrink-0">{act.costEstimate}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{act.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white dark:bg-gray-800/80 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                <p><span className="font-bold text-gray-700 dark:text-gray-300">Stay Reference:</span> {dayObj.accommodation}</p>
                <p><span className="font-bold text-gray-700 dark:text-gray-300">Food Spot Options:</span> {dayObj.dining}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Money Saving Tips */}
        {data.moneySavingTips && (
          <div className="bg-yellow-50/40 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-900/30 p-4 rounded-xl">
            <h4 className="font-bold text-yellow-800 dark:text-yellow-400 text-sm mb-2 flex items-center gap-1.5">
              <FaPiggyBank /> Strategic Money-Saving Tips
            </h4>
            <ul className="list-disc pl-5 text-xs text-gray-700 dark:text-gray-300 space-y-1">
              {data.moneySavingTips.map((tip, tIdx) => (
                <li key={tIdx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Alternative Budget Tiers */}
        {data.recommendedTiers && (
          <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700/60">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-1.5">
              <FaCheckCircle className="text-green-500" /> Alternate Mode Budget Tiers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
              <div className="p-2 bg-white dark:bg-gray-800 border rounded-lg"><p className="font-bold text-gray-400">Budget Tier</p><p className="font-semibold text-gray-900 dark:text-white mt-0.5">{data.recommendedTiers.budgetTrip}</p></div>
              <div className="p-2 bg-white dark:bg-gray-800 border rounded-lg"><p className="font-bold text-primary">Standard Mode</p><p className="font-semibold text-gray-900 dark:text-white mt-0.5">{data.recommendedTiers.comfortableStandard}</p></div>
              <div className="p-2 bg-white dark:bg-gray-800 border rounded-lg"><p className="font-bold text-green-500">Premium Tier</p><p className="font-semibold text-gray-900 dark:text-white mt-0.5">{data.recommendedTiers.premiumLuxury}</p></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Design or recall custom itineraries with your centralized travel command unit.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium rounded-xl text-sm">{error}</div>}
        {successMsg && <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 font-medium rounded-xl text-sm">{successMsg}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: FORM PLANNER CONTROL */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 self-start">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaPlus className="text-primary text-sm" /> Plan a New Trip
            </h2>
            <form onSubmit={handleGenerateTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Where to?</label>
                <input
                  type="text"
                  name="destination"
                  value={destination}
                  onChange={handleFormChange}
                  placeholder="e.g. Ooty, Goa, Paris"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Strategy</label>
                <select
                  name="budget"
                  value={budget}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                >
                  <option value="Budget">Budget (Low Cost)</option>
                  <option value="Moderate">Moderate (Standard)</option>
                  <option value="Luxury">Luxury (Premium)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Travelers</label>
                <input
                  type="number"
                  name="travelers"
                  value={travelers}
                  onChange={handleFormChange}
                  min="1"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>
              <button
  type="submit"
  disabled={generating}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
>
  {generating ? (
    <>
      <FaSpinner className="animate-spin" />
      Planning Journey...
    </>
  ) : (
    'Generate Itinerary'
  )}
</button>
            </form>
          </div>

          {/* COLUMN 2 & 3: DISPLAY AND ARCHIVE PANELS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* LIVE PREVIEW SCREEN MAPPER (FIXED: NOW RENDERS THE FULL INFRASTRUCTURE IMMEDIATELY) */}
            {generatedItinerary && (
              <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800/40 dark:to-surface-dark p-6 rounded-2xl border-2 border-primary/30 shadow-md">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="text-xl font-extrabold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                    <FaSuitcase /> Live Generation Preview
                  </h3>
                  <button
                    onClick={handleSaveTrip}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <FaSave /> Save to Dashboard
                  </button>
                </div>
                {renderItineraryDetails(generatedItinerary)}
              </div>
            )}

            {/* SAVED REPOSITORY CONTAINER */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Saved Itineraries</h2>
              
              {loadingTrips ? (
                <div className="flex justify-center items-center py-12"><FaSpinner className="animate-spin text-3xl text-primary" /></div>
              ) : trips.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FaPlane className="text-4xl mx-auto text-gray-300 mb-3 transform -rotate-45" />
                  <p className="font-medium">No saved plans found. Fill out the planner to begin.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trips.map((trip) => (
                    <div
                      key={trip._id}
                      onClick={() => setSelectedTrip(selectedTrip?._id === trip._id ? null : trip)}
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${selectedTrip?._id === trip._id ? 'border-primary bg-blue-50/10 dark:bg-blue-900/10 shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/40'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-red-500 text-sm" /> {trip.destination}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FaDollarSign /> {trip.budget}</span>
                            <span className="flex items-center gap-1"><FaUsers /> {trip.travelers} Traveler(s)</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteTrip(trip._id, e)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {selectedTrip?._id === trip._id && trip.itineraryData && (
                        <div className="mt-4 border-t border-gray-100 dark:border-gray-700/60" onClick={(e) => e.stopPropagation()}>
                          {renderItineraryDetails(trip.itineraryData)}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}