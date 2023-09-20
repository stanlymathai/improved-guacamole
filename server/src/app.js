const middlewares = require('./middlewares/app.middleware');
const errorHandlers = require('./utils/errorHandler.util');

// Loads .env file contents for local development.
if (!process.env.APP_ENV) require('dotenv').config();

// db connection.
const db = require('./configs/db.config');
db.initialize_connection();

// Creating an Express app.
const app = require('express')();

// Middlewares
middlewares(app);
errorHandlers(app);

// Routes
app.use(process.env.API_ENDPOINT + '/', require('./routes'));

module.exports = app;
