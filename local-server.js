// Local development server — mirrors Vercel serverless API functions
// Run with: node local-server.js
// Then in another terminal: npm start

require('dotenv').config();
const http = require('http');
const url = require('url');

const weatherHandler = require('./api/weather');
const forecastHandler = require('./api/forecast');
const aqiHandler = require('./api/aqi');

const PORT = 3001;

function createMockRes(res) {
  return {
    _status: 200,
    _headers: {},
    status(code) { this._status = code; return this; },
    setHeader(k, v) { this._headers[k] = v; return this; },
    json(data) {
      res.writeHead(this._status, { 'Content-Type': 'application/json', ...this._headers });
      res.end(JSON.stringify(data));
    },
  };
}

const routes = {
  '/api/weather':  weatherHandler,
  '/api/forecast': forecastHandler,
  '/api/aqi':      aqiHandler,
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const handler = routes[parsed.pathname];

  if (handler) {
    const mockReq = { query: parsed.query, method: req.method };
    const mockRes = createMockRes(res);
    handler(mockReq, mockRes).catch(err => {
      console.error(err);
      res.writeHead(500); res.end('Internal server error');
    });
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🌤️  WeatherNow API running at http://localhost:${PORT}`);
  console.log('   Routes: /api/weather  /api/forecast  /api/aqi\n');
});
