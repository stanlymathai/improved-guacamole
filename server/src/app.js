const express = require('express');

const middlewares = require('./middlewares');
const errorHandlers = require('./utils/errorHandler.util');

if (!process.env.NODE_ENV) {
  // Loads .env file contents into process.env.
  require('dotenv').config({ path: './src/configs/env/local.env' });
}

// // db config.
// const db = require('./configs/db.config');
// db.test_conn();

// // Handling various shutdown signals
// process.on('SIGINT', db.shutdown); // On Ctrl+C

// // On process termination request (e.g., from Docker/K8s)
// process.on('SIGTERM', db.shutdown);

// Creating an Express app.
const app = express();

middlewares(app); // Set up basic middlewares
errorHandlers(app); // Central error handling

// routing requests.
// const routes = require('./routes/versions/v1.version');
// const apiEndpoint = process.env.ENDPOINT_API || '/api/v1';
// app.use(apiEndpoint, routes);

module.exports = app;
