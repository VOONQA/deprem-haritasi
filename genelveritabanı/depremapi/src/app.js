const express = require('express');
const earthquakeRouter = require('./controllers/earthquakeController');

const app = express();

app.use(express.json());
app.use('/api/earthquakes', earthquakeRouter);

module.exports = app;