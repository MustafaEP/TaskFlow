const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Basit validation
        if(!email || !password) {
            return res.status(400).json({ message: 'Email ve şifre gereklidir' });
        }

        //Email kontrolü
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: 'Bu email zaten kullanılıyor' });
        }

        //Kullanıcı oluşturma
        const user = await User.create({
            email,
            password,
        });

        return res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Kullanıcı oluşturma hatası', 
            error: error.message 
        });
    }
};

module.exports = { register };