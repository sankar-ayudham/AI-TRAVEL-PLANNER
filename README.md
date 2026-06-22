````md
Live Demo: https://journey-pilot.vercel.app
# ✈️ JourneyPilot 

JourneyPilot is a premium, full-stack travel orchestration platform that transforms chaotic vacation planning into structured, route-optimized, and budget-itemized travel blueprints. Driven by Gemini AI intelligence and built on the robust MERN stack, it eliminates backtracking and calculates realistic financial baselines purely in Indian Rupees (₹).

---

## 🚀 Key Value Features

### 🗺️ Backtrack-Free Routing Engine
Generates an optimized daily transit track, stringing together landmarks logically using local transit suggestions (auto-rickshaws, metro lines, walking paths) to save hours of travel time.

### 📊 Itemized INR Cost Matrices
Provides a completely transparent budget table breaking down intercity travel, hotel stay benchmarks, food allowances, and actual attraction entry ticket rates natively in ₹.

### 🌓 Seamless Midnight Suite
Features a fully fluid theme engine built directly on Tailwind utility classes, toggleable instantly from the persistent navigation command header.

### 🔒 Secure Cloud Archiving
Implements enterprise-grade authentication tracking sessions via JSON Web Tokens (JWT) and safely logging customized travel itineraries inside a clustered MongoDB Atlas environment.

### ⚡ Dual-Engine Failover Allocation
Features an integrated backend error-handling system that instantly routes user requests to alternative stable pipelines if primary AI models encounter high-traffic demand spikes.

---

## 🛠️ Technological Architecture

### Backend Core
* **Node.js & Express.js** – Server lifecycle administration and API routing controllers.
* **MongoDB Atlas & Mongoose** – Cloud cluster object-modeling document store.
* **Google Gen AI SDK** – Dynamic context-aware inference prompt orchestration using Gemini models.
* **JSON Web Tokens (JWT) & Bcrypt** – Secure credential-hashing authentication shielding.

### Frontend Presentation
* **React (Vite)** – Next-generation single-page application framework.
* **Tailwind CSS** – Fully componentized utility-first styling system.
* **React Router DOM** – Declarative client-side page routing.
* **Axios** – Centralized HTTP request and response handling.

---

## 📂 Project Structure

```text
journey-pilot/
│
├── client/
│   ├── src/
│   │   ├── components/       # Custom Navbar and branding assets
│   │   ├── context/          # AppContext global state manager
│   │   ├── pages/            # View screens (Home, Dashboard, Profile, Login)
│   │   └── api.js            # Unified Axios connection configuration
│   ├── public/
│   └── package.json
│
├── server/
│   ├── middleware/           # Protected route token authorization checks
│   ├── models/               # MongoDB user and trip schemas
│   ├── routes/               # API endpoints for authentication and generation
│   ├── .env                  # Port, API keys, and connection variables
│   ├── server.js             # Central app starting engine
│   └── package.json
│
├── .gitignore
└── README.md
````

## 💻 Local Installation & Deployment Setup

### 1. Prerequisites

Ensure the following software is installed:

* Node.js (Latest LTS Version)
* npm
* MongoDB Atlas Account
* Google AI Studio API Key

### 2. Clone Repository

```bash
git clone <your-github-repository-url>
cd journey-pilot
```

### 3. Backend Setup

Navigate into the backend folder:

```bash
cd server
npm install
```

Create a `.env` file inside the server directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/journeypilot
JWT_SECRET=your_super_secure_production_token_secret
GEMINI_API_KEY=your_google_ai_studio_api_key
```

Start the backend server:

```bash
node server.js
```

Backend will run at:

```text
http://localhost:5000
```

### 4. Frontend Setup

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

## 🌐 Environment Variables

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| PORT           | Backend server port mapping allocation (Default: 5000)         |
| MONGO_URI      | Secure MongoDB Atlas cloud connection database string          |
| JWT_SECRET     | Cryptographic token signature hash for user verification       |
| GEMINI_API_KEY | Google AI Studio access key for generating dynamic itineraries |

## 🔐 Security Features

* Password encryption and hashing using Bcrypt.
* Stateless validation layer utilizing JWT authentication.
* Protected API client-side routing shields preventing unauthorized access.
* Database safety through strict connection string environment variable isolation.
* Distributed cloud clustering inside MongoDB Atlas secure environments.

## 📈 Future Enhancements

* Real-time local destination weather forecast integration.
* Live flight and hotel API aggregation engines.
* Geolocation placement tracking using live Google Maps route optimization.
* Direct formatting pipelines for PDF itinerary export layouts.
* Shared travel boards for multi-user collaborative trip planning.

## 🚀 Production Deployment

### Backend

Deploy on:

* Render
* Railway
* AWS EC2

### Frontend

Deploy on:

* Vercel
* Netlify
* Cloudflare Pages

### Database

Clustered on:

* MongoDB Atlas

## 📜 License

MIT License

Copyright (c) 2026 JourneyPilot

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

```
```
