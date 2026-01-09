const User = require('../models/User');
const generateToken = require("../utils/jwt");

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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validation
        if(!email || !password) {
            return res.status(400).json({ 
                message: 'Email ve şifre gereklidir' 
            });
        }

        //Kullanıcı bulma
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(401).json({ 
                message: 'Email veya şifre hatalı' 
            });
        }

        //Şifre kontrolü
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(401).json({ 
                message: 'Email veya şifre hatalı', 
            });
        }

        //Token oluşturma
        const token = generateToken({ 
            id: user._id,
            role: user.role,
        });

        //Response
        res.status(200).json({ 
            message: 'Giriş başarılı', 
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Login sitasında hata oluştu', 
            error: error.message,
        });
    }
};

module.exports = { register, login };