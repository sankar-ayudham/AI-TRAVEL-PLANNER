
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaRoute,
  FaRupeeSign,
  FaCalendarAlt,
  FaUsers,
  FaCompass,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { AppContext } from '../context/AppContext.jsx';

const features = [
  {
    icon: FaRoute,
    number: '01',
    title: 'Less time travelling',
    description:
      'Plan your sightseeing in a sensible order, so you can spend more time exploring and less time crossing the city.',
    color: 'sage',
  },
  {
    icon: FaRupeeSign,
    number: '02',
    title: 'Know your budget',
    description:
      'See estimated expenses for transport, accommodation, food and activities before you set off.',
    color: 'clay',
  },
  {
    icon: FaCalendarAlt,
    number: '03',
    title: 'A plan for every day',
    description:
      'Turn your travel dates into a practical morning, afternoon and evening itinerary.',
    color: 'sand',
  },
  {
    icon: FaUsers,
    number: '04',
    title: 'Made for your group',
    description:
      'Plan a solo escape, a couple’s getaway or a trip with friends using your group size and budget.',
    color: 'sage',
  },
];

const destinations = [
  {
    name: 'The coastal escape',
    place: 'Visakhapatnam, Andhra Pradesh',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85',
    tag: 'SEA & SLOW DAYS',
  },
  {
    name: 'Into the mountains',
    place: 'Himachal Pradesh, India',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    tag: 'MOUNTAINS & TRAILS',
  },
  {
    name: 'A little history',
    place: 'Hampi, Karnataka',
    image:
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=85',
    tag: 'CULTURE & HERITAGE',
  },
];

export default function Home() {
  const { user } = useContext(AppContext);
  const primaryPath = user ? '/dashboard' : '/register';

  return (
    <main className="journey-home">
      <section className="journey-hero">
        <div className="journey-hero-image" aria-hidden="true" />

        <div className="journey-hero-inner">
          <div className="journey-hero-copy">
            <span className="journey-eyebrow">
              <span className="journey-eyebrow-line" />
              A little more adventure, a little less planning
            </span>

            <h1>
              The best trips
              <br />
              start with <em>a feeling.</em>
            </h1>

            <p className="journey-hero-description">
              Tell us where you want to go, when you can leave and what
              you want to spend. We’ll help turn your ideas into a trip
              you can actually plan around.
            </p>

            <div className="journey-hero-actions">
              <Link to={primaryPath} className="journey-button journey-button-dark">
                {user ? 'Plan a new trip' : 'Plan your first trip'}
                <FaArrowRight aria-hidden="true" />
              </Link>

              {!user && (
                <Link to="/login" className="journey-text-link">
                  Already have an account? Sign in
                </Link>
              )}
            </div>

            <div className="journey-hero-note">
              <span className="journey-note-dot" />
              Your dates. Your budget. Your kind of trip.
            </div>
          </div>

          <div className="journey-postcard" aria-label="Travel inspiration">
            <img
              src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=850&q=85"
              alt="Ocean waves rolling towards a sandy coastline"
              fetchPriority="high"
            />
            <div className="journey-postcard-caption">
              <div>
                <span>YOUR NEXT CHAPTER</span>
                <strong>Somewhere by the sea.</strong>
              </div>
              <FaCompass aria-hidden="true" />
            </div>
            <span className="journey-postcard-stamp" aria-hidden="true">
              GO
              <br />
              EXPLORE
            </span>
          </div>

          <div className="journey-hero-index" aria-hidden="true">
            <span>01</span>
            <span className="journey-index-rule" />
            <span>MADE FOR THE JOURNEY</span>
          </div>
        </div>
      </section>

      <section className="journey-intro" id="how-it-works">
        <div className="journey-section-label">
          <span>THE IDEA IS SIMPLE</span>
          <span className="journey-label-rule" />
        </div>

        <div className="journey-intro-grid">
          <h2>
            Less planning
            <br />
            <em>on a screen.</em>
            <br />
            More stories to tell.
          </h2>

          <div className="journey-intro-copy">
            <p>
              A good trip isn’t about squeezing everything into a
              schedule. It’s about knowing where you’re going, having a
              sensible budget and leaving room for the unexpected.
            </p>
            <p>
              JourneyPilot uses AI to help you put the pieces together.
              Think of the itinerary as a starting point you can adjust
              to suit yourself—not a schedule you have to follow.
            </p>
            <Link to={primaryPath} className="journey-underlined-link">
              Let’s plan something <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="journey-features" id="features">
        <div className="journey-section-heading">
          <div>
            <div className="journey-section-label">
              <span>THE PRACTICAL DETAILS</span>
              <span className="journey-label-rule" />
            </div>
            <h2>
              All the important bits.
              <br />
              <em>Thoughtfully put together.</em>
            </h2>
          </div>

          <p>
            From your first idea to the little details of each day,
            keep your travel plans in one place.
          </p>
        </div>

        <div className="journey-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="journey-feature"
                key={feature.number}
              >
                <div className={`journey-feature-icon ${feature.color}`}>
                  <Icon aria-hidden="true" />
                </div>

                <div className="journey-feature-meta">
                  <span>{feature.number}</span>
                  <span className="journey-feature-meta-rule" />
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>

        <p className="journey-estimate-note">
          A note on estimates: AI-generated prices, routes and timings
          are suggestions, not live-verified quotes or guarantees.
          Check important details before you travel.
        </p>
      </section>

      <section className="journey-destinations" id="destinations">
        <div className="journey-section-heading">
          <div>
            <div className="journey-section-label">
              <span>PLACES TO GET LOST IN</span>
              <span className="journey-label-rule" />
            </div>
            <h2>
              Where will you
              <br />
              <em>wake up next?</em>
            </h2>
          </div>

          <p>
            A few ideas to get you dreaming. The next adventure is
            yours to choose.
          </p>
        </div>

        <div className="journey-destination-grid">
          {destinations.map((destination, index) => (
            <article
              className="journey-destination-card"
              key={destination.name}
            >
              <div className="journey-destination-image-wrap">
                <img
                  src={destination.image}
                  alt={destination.place}
                  loading="lazy"
                />
                <span className="journey-destination-number">
                  0{index + 1}
                </span>
              </div>

              <div className="journey-destination-details">
                <span>{destination.tag}</span>
                <h3>{destination.name}</h3>
                <p>
                  <FaMapMarkerAlt aria-hidden="true" />
                  {destination.place}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="journey-bottom-cta">
          <div>
            <span>YOUR NEXT ADVENTURE STARTS HERE</span>
            <h2>
              Got somewhere
              <br />
              <em>in mind?</em>
            </h2>
          </div>

          <Link to={primaryPath} className="journey-button journey-button-light">
            Let’s make a plan
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="journey-footer">
        <Link to="/" className="journey-footer-brand">
          journey<span>pilot</span>.
        </Link>
        <p>Made for the places you haven’t been yet.</p>
        <Link to="/profile" className="journey-footer-link">
          Your travel profile
        </Link>
      </footer>
    </main>
  );
}
