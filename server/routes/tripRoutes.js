
const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai');

const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Gemini using GEMINI_API_KEY from the environment.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Validate the trip details supplied by the client.
function validateTripInput({ destination, startDate, endDate, budget, travelers }) {
  if (
    typeof destination !== 'string' ||
    !destination.trim() ||
    destination.trim().length > 200
  ) {
    return 'Destination must be a non-empty string of at most 200 characters';
  }

  if (
    typeof startDate !== 'string' ||
    typeof endDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
  ) {
    return 'Start and end dates must use YYYY-MM-DD format';
  }

  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start.toISOString().slice(0, 10) !== startDate ||
    end.toISOString().slice(0, 10) !== endDate
  ) {
    return 'Please provide valid calendar dates';
  }

  if (end < start) {
    return 'End date cannot be before start date';
  }

  // Limit trip duration to prevent unnecessarily large AI requests.
  const durationDays = (end - start) / (24 * 60 * 60 * 1000) + 1;

  if (durationDays > 30) {
    return 'Trip duration cannot exceed 30 days';
  }

  if (!['Budget', 'Moderate', 'Luxury'].includes(budget)) {
    return 'Budget must be Budget, Moderate, or Luxury';
  }

  if (
    !Number.isInteger(travelers) ||
    travelers < 1 ||
    travelers > 20
  ) {
    return 'Travelers must be an integer between 1 and 20';
  }

  return null;
}

// Generate an itinerary with Gemini.
// POST /api/trips/generate
router.post('/generate', auth, async (req, res) => {
  const validationError = validateTripInput(req.body || {});

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { destination, startDate, endDate, budget, travelers } = req.body;

  const prompt = `
You are a travel itinerary assistant.

Create a practical travel itinerary for the following trip:
Destination: ${destination.trim()}
Travelers: ${travelers}
Budget category: ${budget}
Start date: ${startDate}
End date: ${endDate}

Use Indian Rupees (₹) for cost estimates.
Provide realistic estimates, but do not claim prices or availability are live-verified.
Do not claim that routes are guaranteed to be optimal.
Return only a valid JSON object with this structure:
{
  "summary": "Trip overview",
  "estimatedTotalCost": "Estimated cost in INR",
  "budgetBreakdownTable": {
    "intercityTravel": "Estimated cost",
    "hotelStay": "Estimated cost",
    "foodAndDining": "Estimated cost",
    "localSightseeingTransport": "Estimated cost",
    "entryTickets": "Estimated cost",
    "grandTotalRange": "Estimated cost range"
  },
  "recommendedTiers": {
    "budgetTrip": "Estimated cost",
    "comfortableStandard": "Estimated cost",
    "premiumLuxury": "Estimated cost"
  },
  "moneySavingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "dayFocus": "Area name",
      "dayCostRange": "Estimated cost",
      "optimizedRoute": "Suggested route",
      "activities": [
        {
          "time": "Morning",
          "title": "Activity",
          "description": "Details",
          "costEstimate": "Estimated cost"
        }
      ],
      "accommodation": "Suggested area",
      "dining": "Suggested dining options"
    }
  ]
}

Generate one daily itinerary entry for each day of the trip.
Treat costs, travel times, opening hours, and availability as estimates unless independently verified.
`;

  try {
    let response;

    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
    } catch (primaryError) {
      // Attempt a fallback only when the primary model call fails.
      console.error('Primary Gemini request failed:', primaryError.message);

      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
    }

    if (!response || typeof response.text !== 'string') {
      return res.status(502).json({
        message: 'The AI service returned an empty response. Please try again.',
      });
    }

    let itineraryData;

    try {
      itineraryData = JSON.parse(response.text);
    } catch {
      return res.status(502).json({
        message: 'The AI service returned an invalid itinerary. Please try again.',
      });
    }

    if (
      !itineraryData ||
      typeof itineraryData !== 'object' ||
      !Array.isArray(itineraryData.dailyItinerary) ||
      itineraryData.dailyItinerary.length === 0
    ) {
      return res.status(502).json({
        message: 'The AI service returned an incomplete itinerary.',
      });
    }

    return res.status(200).json(itineraryData);
  } catch (error) {
    console.error('Itinerary generation failed:', error.message);

    return res.status(502).json({
      message: 'Unable to generate an itinerary right now. Please try again later.',
    });
  }
});

// Save a generated trip.
// POST /api/trips
router.post('/', auth, async (req, res) => {
  const { destination, startDate, endDate, budget, travelers, itineraryData } =
    req.body || {};

  const validationError = validateTripInput({
    destination,
    startDate,
    endDate,
    budget,
    travelers,
  });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  if (
    !itineraryData ||
    typeof itineraryData !== 'object' ||
    Array.isArray(itineraryData) ||
    !Array.isArray(itineraryData.dailyItinerary)
  ) {
    return res.status(400).json({
      message: 'A valid itinerary is required',
    });
  }

  try {
    const savedTrip = await Trip.create({
      user: req.user.id,
      destination: destination.trim(),
      startDate,
      endDate,
      budget,
      travelers,
      itineraryData,
    });

    return res.status(201).json(savedTrip);
  } catch (error) {
    console.error('Trip save failed:', error.message);

    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        message: 'Trip data is invalid',
      });
    }

    return res.status(500).json({
      message: 'Unable to save trip right now',
    });
  }
});

// Get only the authenticated user's saved trips.
// GET /api/trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json(trips);
  } catch (error) {
    console.error('Trip history fetch failed:', error.message);

    return res.status(500).json({
      message: 'Unable to retrieve trips right now',
    });
  }
});

// Delete a trip only if it belongs to the authenticated user.
// DELETE /api/trips/:id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid trip ID',
    });
  }

  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deletedTrip) {
      return res.status(404).json({
        message: 'Trip not found',
      });
    }

    return res.status(200).json({
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    console.error('Trip deletion failed:', error.message);

    return res.status(500).json({
      message: 'Unable to delete trip right now',
    });
  }
});

module.exports = router;
