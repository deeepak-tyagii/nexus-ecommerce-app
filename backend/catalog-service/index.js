
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const app = express();
app.use(cors());

// --- Logger Setup ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'catalog-service' },
  transports: [ new winston.transports.Console({ format: winston.format.simple() }) ],
});

const mockProducts = [
  // Electronics
  { id: 1, name: 'QuantumCore Pro Laptop', description: 'High-performance laptop for demanding professional workloads.', price: 2250, emoji: '💻' },
  { id: 2, name: 'Aether-9 Smartphone', description: 'The latest generation smartphone with a stunning holographic display.', price: 999, emoji: '📱' },
  { id: 3, name: 'Acoustic Bliss Headphones', description: 'Studio-grade, noise-cancelling headphones for immersive audio.', price: 349, emoji: '🎧' },
  { id: 4, name: 'Chrono-Sync Smartwatch', description: 'Seamlessly integrate your digital life and track biometrics.', price: 449, emoji: '⌚' },
  { id: 5, name: 'LumiCapture 8K Camera', description: 'Capture stunning photos and cinematic 8K video.', price: 1650, emoji: '📷' },
  { id: 6, name: 'Aero-Buds Pro', description: 'Compact, high-fidelity wireless earbuds with spatial audio.', price: 199, emoji: '🎶' },
  // Apparel
  { id: 7, name: 'Urban Explorer Jacket', description: 'All-weather, breathable technical jacket for the modern commuter.', price: 295, emoji: '🧥' },
  { id: 8, name: 'Heritage Denim Jeans', description: 'Classic straight-fit jeans crafted from premium selvedge denim.', price: 185, emoji: '👖' },
  { id: 9, name: 'Executive Silk Blouse', description: 'A timeless silk blend blouse for professional and formal wear.', price: 150, emoji: '👚' },
  // Groceries
  { id: 10, name: 'Artisanal Sourdough Loaf', description: 'Hand-crafted, naturally leavened sourdough bread.', price: 12, emoji: '🍞' },
  { id: 11, name: 'Organic Avocado Medley', description: 'A curated selection of three premium organic avocado varieties.', price: 9, emoji: '🥑' },
  { id: 12, name: 'Himalayan Pink Salt Grinder', description: 'Mineral-rich pink salt in a convenient, adjustable grinder.', price: 15, emoji: '🧂' },
];

// Using Express Router for cleaner route grouping
const router = express.Router();
router.get('/products', (req, res) => {
  logger.info('Request received for /products');
  res.json(mockProducts);
});
router.get('/error', (req, res) => {
  const errorMessage = `Database connection failed: Cannot read property 'connect' of undefined.`;
  const stackTrace = `TypeError: Cannot read property 'connect' of undefined
at /app/src/db/connector.js:12:25
at processTicksAndRejections (internal/process/task_queues.js:95:5)
at async /app/src/api/products.js:45:9`;
  logger.error(errorMessage, { stack: stackTrace });
  res.status(500).send('Internal Server Error: A simulated database error has occurred.');
});

// All routes for this service will be prefixed with /api/catalog
app.use('/api/catalog', router);

const port = process.env.PORT || 4001;
app.listen(port, () => {
  logger.info(`Catalog service listening on http://localhost:${port}`);
  setInterval(() => {
    logger.info('Performing periodic inventory sync with supplier database.');
  }, 15000);
});