const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');
    } catch (error) {
        console.log('MongoDB bağlantısı hatası:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;