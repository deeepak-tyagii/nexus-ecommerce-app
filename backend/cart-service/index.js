const expressCart = require('express');
const corsCart = require('cors');
const bodyParserCart = require('body-parser');
const winstonCart = require('winston');
const appCart = expressCart();

appCart.use(corsCart());
appCart.use(bodyParserCart.json());

const loggerCart = winstonCart.createLogger({
  level: 'info',
  format: winstonCart.format.json(),
  defaultMeta: { service: 'cart-service' },
  transports: [ new winstonCart.transports.Console({ format: winstonCart.format.simple() }) ],
});

let carts = {};

const routerCart = expressCart.Router();

routerCart.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  loggerCart.info(`GET /cart/${userId}`);
  res.json(carts[userId] || { items: {} });
});

routerCart.post('/cart/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  loggerCart.info(`POST /cart/${userId}/add - Product: ${productId}`);
  if (!carts[userId]) carts[userId] = { items: {} };
  carts[userId].items[productId] = (carts[userId].items[productId] || 0) + 1;
  res.json(carts[userId]);
});

routerCart.post('/cart/:userId/remove', (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;
    loggerCart.info(`POST /cart/${userId}/remove - Product: ${productId}`);
    if (carts[userId] && carts[userId].items[productId]) delete carts[userId].items[productId];
    res.json(carts[userId] || { items: {} });
});

routerCart.post('/cart/:userId/clear', (req, res) => {
    const { userId } = req.params;
    loggerCart.info(`POST /cart/${userId}/clear`);
    carts[userId] = { items: {} };
    res.json(carts[userId]);
});

routerCart.get('/error', (req, res) => {
  const errorMessage = `Redis cache timeout: Connection timed out after 3000ms.`;
   const stackTrace = `TimeoutError: Connection timed out
at Redis.client.on.error (/app/node_modules/redis/index.js:632:21)
at Socket.<anonymous> (/app/node_modules/redis/lib/redis.js:212:14)`;
  loggerCart.error(errorMessage, { stack: stackTrace });
  res.status(500).send('Internal Server Error: A simulated cache error has occurred.');
});

// All routes for this service will be prefixed with /api/cart
appCart.use('/api/cart', routerCart);

const portCart = process.env.PORT || 4002;
appCart.listen(portCart, () => {
  loggerCart.info(`Cart service listening on http://localhost:${portCart}`);
  setInterval(() => {
    const abandonedCarts = Object.keys(carts).length;
    loggerCart.info(`Checking for abandoned carts. Found ${abandonedCarts} active carts.`);
  }, 20000);
});
