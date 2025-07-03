const expressOrder = require('express');
const corsOrder = require('cors');
const bodyParserOrder = require('body-parser');
const winstonOrder = require('winston');
const appOrder = expressOrder();

appOrder.use(corsOrder());
appOrder.use(bodyParserOrder.json());

const loggerOrder = winstonOrder.createLogger({
  level: 'info',
  format: winstonOrder.format.json(),
  defaultMeta: { service: 'order-service' },
  transports: [ new winstonOrder.transports.Console({ format: winstonOrder.format.simple() }) ],
});

let orders = {};

const routerOrder = expressOrder.Router();

routerOrder.get('/orders/:userId', (req, res) => {
  const { userId } = req.params;
  loggerOrder.info(`Request for orders for user: ${userId}`);
  res.json(orders[userId] || []);
});

routerOrder.post('/orders/:userId/create', (req, res) => {
  const { userId } = req.params;
  const orderValue = Object.keys(req.body.cart.items).length * 150; // Simplified value
  loggerOrder.info(`Order received from user ${userId} via frontend.`, {
      event: 'order_placed',
      userId: userId,
      country: 'US', // Assume frontend users are from US
      paymentMethod: 'Card',
      value: orderValue,
      status: 'success'
  });
  if (!orders[userId]) orders[userId] = [];
  const newOrder = {
    id: `ORD-${Date.now()}`,
    userId,
    items: req.body.cart.items,
    createdAt: new Date().toISOString(),
    status: 'Processing',
  };
  orders[userId].push(newOrder);
  res.json(newOrder);
});

routerOrder.get('/error', (req, res) => {
  const errorMessage = `Payment gateway integration error: Invalid API Key provided.`;
  const stackTrace = `AuthenticationError: Invalid API Key
at Stripe.charges.create (/app/node_modules/stripe/lib/stripe.js:445:21)
at createPayment (/app/src/services/payment_gateway.js:88:15)`;
  loggerOrder.error(errorMessage, { stack: stackTrace });
  res.status(500).send('Internal Server Error: A simulated payment gateway error has occurred.');
});

// --- Business Log Simulation Data ---
const countries = ['IN', 'US', 'UK', 'DE', 'AU'];
const paymentMethods = ['Card', 'UPI', 'Cash on Delivery', 'Net Banking'];
const failureReasons = ['Insufficient funds', 'Gateway timeout', 'Invalid CVV', 'Blocked card'];
const userNames = ['Aarav', 'John', 'Priya', 'Emily', 'Chen', 'Fatima'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const simulateBusinessLogs = () => {
    const country = getRandomElement(countries);
    const paymentMethod = getRandomElement(paymentMethods);
    const user = getRandomElement(userNames);
    const orderValue = (Math.random() * 200 + 20).toFixed(2);
    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (isSuccess) {
        loggerOrder.info(`Payment successful for user '${user}' from ${country}.`, {
            event: 'payment_success',
            country: country,
            paymentMethod: paymentMethod,
            value: parseFloat(orderValue),
            status: 'success'
        });
    } else {
        const reason = getRandomElement(failureReasons);
        loggerOrder.warn(`Payment failed for user '${user}' from ${country}. Reason: ${reason}.`, {
            event: 'payment_failed',
            country: country,
            paymentMethod: paymentMethod,
            value: parseFloat(orderValue),
            failureReason: reason,
            status: 'failure'
        });
    }
};

// All routes for this service will be prefixed with /api/order
appOrder.use('/api/order', routerOrder);

const portOrder = process.env.PORT || 4003;
appOrder.listen(portOrder, () => {
  loggerOrder.info(`Order service listening on http://localhost:${portOrder}`);
  setInterval(simulateBusinessLogs, 7000);
});