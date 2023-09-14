const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

module.exports = (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: false }));
};
