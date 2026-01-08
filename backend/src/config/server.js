const app = require('../app');
const connectDB = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

//DB bağlantısı
connectDB();

app.listen(PORT, () => {
    console.log(`TaskFlow API is running on port ${PORT}`);
});