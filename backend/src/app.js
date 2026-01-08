const express = require('express');

const app = express();

//Middleware
app.use(express.json());


// Routes
app.use('/api/auth', require('./routes/auth.routes'));

//Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'TaskFlow API çalışıyor' });
});

module.exports = app;