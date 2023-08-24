require('dotenv').config();
const { requestLogger } = require('./logger');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const { MONGO_USER, MONGO_PASS, DB_String } = require('./config');

const authOptions = { username: MONGO_USER, password: MONGO_PASS };
const options = { useNewUrlParser: true, useUnifiedTopology: true, auth: authOptions };

mongoose.connect(DB_String, options);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
const app = express();

app.use(cors());
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
});
