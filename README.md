# 🌤️ Premium Weather Dashboard

A state-of-the-art, high-fidelity responsive Weather Application featuring stunning modern aesthetics, seamless glassmorphism, responsive weather canvas animations, detailed Air Quality Index (AQI) reports, a solar tracking arc, and Vercel serverless integration.

---

## ✨ Features

- **💎 Glassmorphic Bento-Grid UI:** A gorgeous, modern visual layout that feels clean, premium, and structured.
- **🎨 Dynamic Weather Backdrops:** Real-time responsive visual effects and custom HSL gradients that adapt instantly to match the weather condition (sunny, rainy, snowy, stormy, foggy, or clear night).
- **☀️ Interactive Sun Arc:** A custom SVG arc widget tracing the sun's actual path throughout the day, showing live progress towards sunset or sunrise based on local time zones.
- **🍃 Air Quality (AQI) Analysis:** Comprehensive reporting of AQI metrics (PM2.5, PM10, NO2, O3, CO) with visual health warning ratings.
- **📈 Advanced Forecasts:** 
  - *Hourly:* Smooth horizontal scrolling forecast showing temperature and conditions for the next 24 hours.
  - *Daily:* A detailed 5-day outlook complete with range sliders indicating daily high/low temperatures.
- **🛡️ Secure Serverless Proxy Architecture:** Weather endpoints are proxied through serverless APIs, keeping API credentials strictly secure on the server side and avoiding CORS issues.

---

## 🛠️ Technology Stack

- **Frontend:** React, HTML5, Vanilla CSS (Premium Flexbox/Grid design system, modern typography via Outfit & Inter fonts, bespoke animations)
- **Backend / Serverless:** Vercel Serverless Functions (`/api/weather`, `/api/forecast`, `/api/aqi`)
- **Local Server:** Express.js (`local-server.js`) for seamless offline-first development
- **Data Provider:** OpenWeatherMap API

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### ⚙️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/khuzaima175/react_weather_wesbite.git
   cd react_weather_wesbite
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   OPENWEATHER_API_KEY=your_free_openweathermap_api_key_here
   ```
   *You can get a free API key from [OpenWeatherMap](https://openweathermap.org/api).*

---

## 🏃 Running the Application

### 💻 Local Development

To run the application locally with a backend proxy, you can start the Express mock server and the React dev environment simultaneously:

```bash
npm run dev
```

Alternatively, you can run them individually:
* **Start React Frontend:** `npm start` (Runs on `http://localhost:3000`)
* **Start Local API Server:** `node local-server.js` (Runs on `http://localhost:5001`)

### ⚡ Serverless Development (Vercel)

If you have the Vercel CLI installed, run the serverless stack directly:

```bash
vercel dev
```

---

## 📁 Repository Structure

```
Weather Website/
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment and routing settings
├── local-server.js       # Express proxy server for local development
├── api/                  # Vercel Serverless Functions
│   ├── weather.js        # Current weather API proxy
│   ├── forecast.js       # Forecast weather API proxy
│   └── aqi.js            # Air Quality Index API proxy
├── public/               # Public assets and index template
└── src/
    ├── App.js            # Main dashboard controller
    ├── App.css           # Custom Glassmorphism UI CSS styles
    ├── index.js          # React entrypoint
    ├── index.css         # Global styles & layout variables
    ├── components/       # Premium React Components
    │   ├── SearchBar.js         # Location search bar
    │   ├── CurrentWeather.js    # Standard current metrics
    │   ├── AQICard.js           # Detailed AQI index
    │   ├── SunArc.js            # Solar solar position tracker
    │   ├── HourlyForecast.js    # Scrollable hourly timeline
    │   ├── DailyForecast.js     # Five day bento list
    │   ├── WeatherStats.js      # Wind, humidity, and pressure grid
    │   └── WeatherBackground.js # Interactive dynamic background generator
    └── utils/
        └── weatherUtils.js      # Weather data normalizers and HSL helper tables
```

---

## 🌐 Deployment

This application is ready to deploy directly to **Vercel** out-of-the-box. The `vercel.json` file is fully pre-configured to build the React application and deploy the `/api/*` directory as Node.js serverless functions.

To deploy using Vercel CLI:
```bash
vercel --prod
```
*Be sure to add the `OPENWEATHER_API_KEY` environment variable in your Vercel Dashboard project settings!*

---

## 📄 License

This project is licensed under the MIT License.
