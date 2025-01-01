const express = require('express');
const cors = require('cors');
const app = express();
const earthquakeRouter = require('./src/controller/earthquakeController');

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use('/api/earthquakes', earthquakeRouter);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});