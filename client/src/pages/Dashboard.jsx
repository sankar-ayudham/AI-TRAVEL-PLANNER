import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import API from '../api';
import {
  FaPlane,
  FaCalendarAlt,
  FaDollarSign,
  FaUsers,
  FaTrash,
  FaPlus,
  FaSave,
  FaSpinner,
  FaSuitcase,
  FaMapMarkerAlt,
  FaRoute,
  FaCheckCircle,
  FaPiggyBank,
  FaArrowRight,
  FaCompass,
  FaClock,
  FaChevronDown,
} from 'react-icons/fa';

const initialForm = {
  destination: '',
  startDate: '',
  endDate: '',
  budget: 'Moderate',
  travelers: 1,
};

const formatDate = (date) => {
  if (!date) return 'Date not set';

  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function Dashboard() {
  const { user } = useContext(AppContext);

  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { destination, startDate, endDate, budget, travelers } = formData;

  useEffect(() => {
    let active = true;

    const loadTrips = async () => {
      try {
        setLoadingTrips(true);
        const res = await API.get('/trips');

        if (active) {
          setTrips(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error('Error fetching trips:', err);

        if (active) {
          setError('We could not load your saved trips. Please try again.');
        }
      } finally {
        if (active) setLoadingTrips(false);
      }
    };

    loadTrips();

    return () => {
      active = false;
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: name === 'travelers' ? Math.max(1, Number(value) || 1) : value,
    }));
  };

  const handleGenerateTrip = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!destination.trim() || !startDate || !endDate) {
      setError('Please enter a destination, start date and end date.');
      return;
    }

    if (endDate < startDate) {
      setError('Your return date cannot be earlier than your start date.');
      return;
    }

    if (new Date(`${startDate}T00:00:00`) < new Date(new Date().toDateString())) {
      setError('Please choose today or a future date for your trip.');
      return;
    }

    setGenerating(true);
    setGeneratedItinerary(null);

    try {
      const res = await API.post('/trips/generate', {
        ...formData,
        destination: destination.trim(),
      });

      setGeneratedItinerary(res.data);
      setSuccessMsg('Your itinerary is ready. Review it before saving.');
    } catch (err) {
      console.error('Generation failure:', err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'We could not generate your itinerary. Please try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!generatedItinerary || saving) return;

    setError('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const payload = {
        ...formData,
        destination: destination.trim(),
        itineraryData: generatedItinerary,
      };

      const res = await API.post('/trips', payload);

      setTrips((current) => [res.data, ...current]);
      setSelectedTrip(res.data);
      setGeneratedItinerary(null);
      setFormData(initialForm);
      setSuccessMsg('Your trip has been saved successfully.');
    } catch (err) {
      console.error('Save trip failure:', err);

      setError(
        err.response?.data?.message ||
          'We could not save this trip. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();

    if (deletingId) return;

    if (!window.confirm('Delete this saved itinerary permanently?')) return;

    setError('');
    setSuccessMsg('');
    setDeletingId(id);

    try {
      await API.delete(`/trips/${id}`);

      setTrips((current) => current.filter((trip) => trip._id !== id));

      if (selectedTrip?._id === id) {
        setSelectedTrip(null);
      }

      setSuccessMsg('Your saved trip has been deleted.');
    } catch (err) {
      console.error('Delete trip failure:', err);
      setError('Could not delete this trip. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderItineraryDetails = (data) => {
    if (!data) return null;

    const expenses = [
      ['Intercity travel', data.budgetBreakdownTable?.intercityTravel || 'Not specified'],
      ['Accommodation', data.budgetBreakdownTable?.hotelStay || 'Not specified'],
      ['Food and dining', data.budgetBreakdownTable?.foodAndDining || 'Not specified'],
      ['Local transport', data.budgetBreakdownTable?.localSightseeingTransport || 'Not specified'],
      ['Attraction tickets', data.budgetBreakdownTable?.entryTickets || 'Not specified'],
    ];

    const total =
      data.budgetBreakdownTable?.grandTotalRange ||
      data.estimatedTotalCost ||
      'Not specified';

    return (
      <div className="jp-itinerary-details">
        {data.summary && (
          <p className="jp-itinerary-summary">{data.summary}</p>
        )}

        <section className="jp-detail-section">
          <div className="jp-detail-heading">
            <span className="jp-detail-icon"><FaDollarSign /></span>
            <div>
              <h4>Know your budget</h4>
              <p>Estimated expenses per person</p>
            </div>
          </div>

          <div className="jp-budget-table-wrap">
            <table className="jp-budget-table">
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Estimated cost</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(([label, amount]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{amount}</td>
                  </tr>
                ))}
                <tr className="jp-budget-total">
                  <td>Estimated total</td>
                  <td>{total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="jp-estimate-disclaimer">
            These are AI-generated estimates, not live prices. Confirm costs
            before booking.
          </p>
        </section>

        <section className="jp-detail-section">
          <div className="jp-detail-heading">
            <span className="jp-detail-icon"><FaRoute /></span>
            <div>
              <h4>Your trip, day by day</h4>
              <p>A suggested schedule to make your days easier</p>
            </div>
          </div>

          {Array.isArray(data.dailyItinerary) &&
          data.dailyItinerary.length > 0 ? (
            <div className="jp-day-list">
              {data.dailyItinerary.map((dayObj, idx) => (
                <article className="jp-day-card" key={`${dayObj.day}-${idx}`}>
                  <div className="jp-day-top">
                    <div className="jp-day-number">
                      <span>DAY</span>
                      <strong>{dayObj.day || idx + 1}</strong>
                    </div>

                    <div className="jp-day-title">
                      <h5>{dayObj.dayFocus || 'Explore the destination'}</h5>
                      <span>
                        <FaDollarSign /> {dayObj.dayCostRange || 'Cost varies'}
                      </span>
                    </div>
                  </div>

                  {dayObj.optimizedRoute && (
                    <div className="jp-route-note">
                      <FaRoute />
                      <p>
                        <strong>Suggested route</strong>
                        {dayObj.optimizedRoute}
                      </p>
                    </div>
                  )}

                  <div className="jp-activity-list">
                    {dayObj.activities?.map((activity, activityIdx) => (
                      <div
                        className="jp-activity"
                        key={`${activity.title}-${activityIdx}`}
                      >
                        <div className="jp-activity-timeline">
                          <span />
                        </div>

                        <div className="jp-activity-content">
                          <div className="jp-activity-top">
                            <div>
                              {activity.time && (
                                <span className="jp-activity-time">
                                  <FaClock /> {activity.time}
                                </span>
                              )}
                              <h6>{activity.title}</h6>
                            </div>

                            {activity.costEstimate && (
                              <span className="jp-activity-cost">
                                {activity.costEstimate}
                              </span>
                            )}
                          </div>

                          {activity.description && (
                            <p>{activity.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="jp-day-extras">
                    {dayObj.accommodation && (
                      <div>
                        <span>STAY</span>
                        <p>{dayObj.accommodation}</p>
                      </div>
                    )}

                    {dayObj.dining && (
                      <div>
                        <span>FOOD & DRINK</span>
                        <p>{dayObj.dining}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="jp-empty-note">
              No daily activities were included in this itinerary.
            </p>
          )}
        </section>

        {Array.isArray(data.moneySavingTips) &&
          data.moneySavingTips.length > 0 && (
            <section className="jp-tips-card">
              <div className="jp-detail-heading">
                <span className="jp-detail-icon"><FaPiggyBank /></span>
                <div>
                  <h4>Spend a little smarter</h4>
                  <p>Money-saving ideas for your trip</p>
                </div>
              </div>
              <ul>
                {data.moneySavingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </section>
          )}

        {data.recommendedTiers && (
          <section className="jp-detail-section">
            <div className="jp-detail-heading">
              <span className="jp-detail-icon"><FaCheckCircle /></span>
              <div>
                <h4>Other ways to travel</h4>
                <p>Compare possible budget levels</p>
              </div>
            </div>

            <div className="jp-tier-grid">
              <div>
                <span>ON A BUDGET</span>
                <p>{data.recommendedTiers.budgetTrip || 'Not available'}</p>
              </div>
              <div>
                <span>COMFORTABLE</span>
                <p>{data.recommendedTiers.comfortableStandard || 'Not available'}</p>
              </div>
              <div>
                <span>A LITTLE LUXURY</span>
                <p>{data.recommendedTiers.premiumLuxury || 'Not available'}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <main className="jp-dashboard">
      <div className="jp-dashboard-inner">
        <header className="jp-dashboard-header">
          <div>
            <div className="jp-dashboard-eyebrow">
              <span /> YOUR TRAVEL JOURNAL
            </div>
            <h1>
              Let’s plan something
              <br />
              <em>worth remembering.</em>
            </h1>
            <p>
              Welcome back{user?.name ? `, ${user.name}` : ''}. Start a new
              adventure or pick up where you left off.
            </p>
          </div>

          <div className="jp-dashboard-compass" aria-label="Go your own way">
  <span className="jp-compass-north">N</span>
  <span className="jp-compass-east">E</span>
  <span className="jp-compass-south">S</span>
  <span className="jp-compass-west">W</span>

  <div className="jp-compass-center">
    <FaCompass />
  </div>

  <span className="jp-compass-caption">GO YOUR OWN WAY</span>
</div>
        </header>

        {error && (
          <div className="jp-message jp-message-error" role="alert">
            {error}
            <button type="button" onClick={() => setError('')} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}

        {successMsg && (
          <div className="jp-message jp-message-success" role="status">
            {successMsg}
            <button type="button" onClick={() => setSuccessMsg('')} aria-label="Dismiss message">
              ×
            </button>
          </div>
        )}

        <div className="jp-dashboard-layout">
          <section className="jp-planner-panel">
            <div className="jp-panel-kicker">THE NEXT ADVENTURE</div>
            <h2>Where to next?</h2>
            <p className="jp-panel-intro">
              A few details are all we need to get you started.
            </p>

            <form onSubmit={handleGenerateTrip} className="jp-planner-form">
              <div className="jp-form-field">
                <label htmlFor="jp-destination">Destination</label>
                <div className="jp-input-with-icon">
                  <FaMapMarkerAlt />
                  <input
                    id="jp-destination"
                    type="text"
                    name="destination"
                    value={destination}
                    onChange={handleFormChange}
                    placeholder="Where would you love to go?"
                    autoComplete="off"
                    required
                    disabled={generating}
                  />
                </div>
              </div>

              <div className="jp-date-grid">
                <div className="jp-form-field">
                  <label htmlFor="jp-start-date">Leaving</label>
                  <input
                    id="jp-start-date"
                    type="date"
                    name="startDate"
                    value={startDate}
                    min={new Date().toLocaleDateString('en-CA')}
                    onChange={handleFormChange}
                    required
                    disabled={generating}
                  />
                </div>

                <div className="jp-form-field">
                  <label htmlFor="jp-end-date">Returning</label>
                  <input
                    id="jp-end-date"
                    type="date"
                    name="endDate"
                    value={endDate}
                    min={startDate || new Date().toLocaleDateString('en-CA')}
                    onChange={handleFormChange}
                    required
                    disabled={generating}
                  />
                </div>
              </div>

              <div className="jp-form-field">
                <label htmlFor="jp-budget">Your kind of comfort</label>
                <select
                  id="jp-budget"
                  name="budget"
                  value={budget}
                  onChange={handleFormChange}
                  disabled={generating}
                >
                  <option value="Budget">Budget — keep it affordable</option>
                  <option value="Moderate">Moderate — a little of everything</option>
                  <option value="Luxury">Luxury — make it special</option>
                </select>
              </div>

              <div className="jp-form-field">
                <label htmlFor="jp-travelers">Who's coming along?</label>
                <div className="jp-input-with-icon">
                  <FaUsers />
                  <input
                    id="jp-travelers"
                    type="number"
                    name="travelers"
                    value={travelers}
                    onChange={handleFormChange}
                    min="1"
                    max="50"
                    required
                    disabled={generating}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="jp-generate-button"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <FaSpinner className="jp-spinner" />
                    <span>Putting your trip together…</span>
                  </>
                ) : (
                  <>
                    <span>Build my itinerary</span>
                    <FaArrowRight />
                  </>
                )}
              </button>

              {generating && (
                <div className="jp-generating-status" role="status" aria-live="polite">
                  <span className="jp-status-dot" />
                  Finding ideas and organising your days. This can take a little
                  while.
                </div>
              )}
            </form>

            <div className="jp-planner-footnote">
              <FaCompass />
              <span>Your dates. Your budget. Your kind of trip.</span>
            </div>
          </section>

          <div className="jp-dashboard-content">
            {generatedItinerary && (
              <section className="jp-itinerary-panel">
                <div className="jp-itinerary-header">
                  <div>
                    <div className="jp-panel-kicker">YOUR PLAN IS READY</div>
                    <h3>{destination}</h3>
                    <p>
                      {formatDate(startDate)} – {formatDate(endDate)}
                      {' · '}
                      {travelers} {Number(travelers) === 1 ? 'traveller' : 'travellers'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveTrip}
                    className="jp-save-button"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="jp-spinner" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save trip
                      </>
                    )}
                  </button>
                </div>

                {renderItineraryDetails(generatedItinerary)}
              </section>
            )}

            <section className="jp-saved-panel">
              <div className="jp-saved-header">
                <div>
                  <div className="jp-panel-kicker">KEPT CLOSE</div>
                  <h2>Your saved journeys</h2>
                  <p>All the trips you’ve been dreaming about, in one place.</p>
                </div>
                <span className="jp-trip-count">
                  {trips.length} {trips.length === 1 ? 'TRIP' : 'TRIPS'}
                </span>
              </div>

              {loadingTrips ? (
                <div className="jp-loading-state" role="status">
                  <FaSpinner className="jp-spinner" />
                  <p>Gathering your saved journeys…</p>
                </div>
              ) : trips.length === 0 ? (
                <div className="jp-empty-state">
                  <div className="jp-empty-icon"><FaPlane /></div>
                  <h3>Your next story starts here.</h3>
                  <p>
                    You haven’t saved a trip yet. Plan one above and it’ll be
                    waiting here for you.
                  </p>
                </div>
              ) : (
                <div className="jp-saved-list">
                  {trips.map((trip) => {
                    const isSelected = selectedTrip?._id === trip._id;

                    return (
                      <article
                        key={trip._id}
                        className={`jp-saved-trip ${isSelected ? 'is-expanded' : ''}`}
                      >
                        <button
                          type="button"
                          className="jp-saved-trip-main"
                          onClick={() =>
                            setSelectedTrip(isSelected ? null : trip)
                          }
                          aria-expanded={isSelected}
                        >
                          <span className="jp-saved-trip-icon">
                            <FaCompass />
                          </span>

                          <span className="jp-saved-trip-copy">
                            <strong>{trip.destination}</strong>
                            <span>
                              <FaCalendarAlt />
                              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                            </span>
                            <span className="jp-saved-trip-meta">
                              <FaUsers /> {trip.travelers} {Number(trip.travelers) === 1 ? 'traveller' : 'travellers'}
                              <i>·</i>
                              {trip.budget}
                            </span>
                          </span>

                          <span className="jp-saved-trip-actions">
                            <span className="jp-expand-icon">
                              <FaChevronDown />
                            </span>
                          </span>
                        </button>

                        <div className="jp-saved-trip-toolbar">
                          <span>Saved itinerary</span>
                          <button
                            type="button"
                            className="jp-delete-button"
                            onClick={(e) => handleDeleteTrip(trip._id, e)}
                            disabled={deletingId === trip._id}
                          >
                            {deletingId === trip._id ? (
                              <FaSpinner className="jp-spinner" />
                            ) : (
                              <FaTrash />
                            )}
                            {deletingId === trip._id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>

                        {isSelected && trip.itineraryData && (
                          <div className="jp-saved-trip-details">
                            {renderItineraryDetails(trip.itineraryData)}
                          </div>
                        )}

                        {isSelected && !trip.itineraryData && (
                          <p className="jp-empty-note">
                            No itinerary details were stored for this trip.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

        <footer className="jp-dashboard-footer">
          <span>JOURNEYPILOT</span>
          <p>Leave room for the unexpected.</p>
        </footer>
      </div>
    </main>
  );
}
