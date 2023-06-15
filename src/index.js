require('dotenv').config();
const swaggerDocs = require('../swagger.js');
const { requestLogger } = require('./logger');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
const app = express();
const router = require('./routes/index');

// app.use(logger('dev'));
app.use(requestLogger);
app.use(express.json());
app.use('/api', router);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
  swaggerDocs(app, 3000);
});
