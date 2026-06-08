const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');

const ai = new GoogleGenAI({});

router.post('/generate', auth, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, travelers } = req.body;

    if (!destination || !startDate || !endDate || !budget || !travelers) {
      return res.status(400).json({ message: 'Please provide all trip details' });
    }

    const prompt = `
You are an expert tour operator and routing analyst. Generate a highly itemized travel itinerary tailored for a trip to ${destination}.
Travelers: ${travelers}
Budget Category: ${budget}
Start Date: ${startDate}
End Date: ${endDate}

CRITICAL RULES:
1. All currency metrics MUST utilize the Indian Rupee symbol (₹).
2. Calculate and present realistic expense breakdowns assuming the journey begins from India (or nearest hub).
3. Ensure every activity details both local route directions and an explicit ticket cost.

Respond ONLY with a valid JSON object. Do not include markdown formatting or \`\`\`json blocks.
The JSON MUST follow this exact structure:
{
  "summary": "A brief overview of the itinerary style.",
  "estimatedTotalCost": "₹XX,XXX total for ${travelers} traveler(s)",
  "budgetBreakdownTable": {
    "intercityTravel": "₹X,XXX - ₹X,XXX",
    "hotelStay": "₹X,XXX - ₹X,XXX",
    "foodAndDining": "₹X,XXX - ₹X,XXX",
    "localSightseeingTransport": "₹X,XXX - ₹X,XXX",
    "entryTickets": "₹X,XXX - ₹X,XXX",
    "grandTotalRange": "₹XX,XXX - ₹XX,XXX"
  },
  "recommendedTiers": {
    "budgetTrip": "₹X,XXX - ₹X,XXX",
    "comfortableStandard": "₹XX,XXX - ₹XX,XXX",
    "premiumLuxury": "₹XX,XXX+"
  },
  "moneySavingTips": [
    "Tip 1 regarding best local transport modes.",
    "Tip 2 regarding accommodation locations.",
    "Tip 3 regarding local food options."
  ],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "dayFocus": "Main geographical area focus name",
      "dayCostRange": "₹X,XXX - ₹X,XXX",
      "optimizedRoute": "Hotel ➔ Attraction A (via local transit mode) ➔ Attraction B (via walking) ➔ Dinner Area",
      "activities": [
        {
          "time": "Morning",
          "title": "Real Place Name",
          "description": "Specific routing notes and visiting actions.",
          "costEstimate": "₹XXX Entry Fee / Transit fare"
        },
        {
          "time": "Afternoon",
          "title": "Real Place Name",
          "description": "Specific routing notes and visiting actions.",
          "costEstimate": "₹XXX Entry Fee / Transit fare"
        },
        {
          "time": "Evening",
          "title": "Real Place Name",
          "description": "Specific routing notes and visiting actions.",
          "costEstimate": "₹XXX Entry Fee / Transit fare"
        }
      ],
      "accommodation": "Recommended budget-matched hotel name or specific area name",
      "dining": "Recommended local restaurant hubs or specific food zones"
    }
  ]
}`;

    let response;
    try {
      console.log('Sending request to primary engine (gemini-2.5-flash)...');
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
    } catch (primaryError) {
      console.warn('Primary engine busy (503). Switching to safe fallback engine (gemini-2.5-flash-lite)...');
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
    }

    const itineraryData = JSON.parse(response.text);
    res.json(itineraryData);

  } catch (error) {
    console.error('Generative engine allocation error:', error);
    res.status(500).json({ message: 'The AI service is processing high volume. Please tap generate again.' });
  }
});

// POST /api/trips - Save trip configuration
router.post('/', auth, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, travelers, itineraryData } = req.body;
    const newTrip = new Trip({
      user: req.user.id,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      itineraryData
    });
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Server error saving route data' });
  }
});

// GET /api/trips - Fetch history index
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error pulling trip files' });
  }
});

// DELETE /api/trips/:id - Erase saved document
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Target plan missing' });
    if (trip.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    await trip.deleteOne();
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;