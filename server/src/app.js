const express = require('express');

const middlewares = require('./middlewares/app.middleware');
const errorHandlers = require('./utils/errorHandler.util');

if (!process.env.APP_ENV) {
  // Loads .env file contents into process.env.
  require('dotenv').config();
}

// db connection.
const db = require('./configs/db.config');
db.initialize_connection();

// Creating an Express app.
const app = express();

middlewares(app); // Set up basic middlewares
errorHandlers(app); // Central error handling

// Routes
app.use(process.env.API_ENDPOINT + '/', require('./routes'));

module.exports = app;
