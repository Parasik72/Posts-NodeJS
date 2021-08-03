const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

const registration = async (req, res, next) => {
    try {
        const { login, password, confirmPassword } = req.body;
        if (!login || !password || !confirmPassword)
            return res.status(400).json({
                error: "All fields must be filled!",
                fields: [
                    'registrationLogin',
                    'registrationPassword',
                    'registrationConfirmPassword'
                ]
            });
        const checkUserLogin = await User.findOne({ login });
        if (checkUserLogin)
            return res.status(400).json({
                error: "Login is taken!",
                fields: [
                    'registrationLogin'
                ]
            });
        if (password !== confirmPassword)
            return res.status(400).json({
                error: "'Password' and 'Confirm password' must be equals!",
                fields: [
                    'registrationPassword',
                    'registrationConfirmPassword'
                ]
            });
        next();
    } catch (error) {
        return res.status(500).json(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { login, password } = req.body;
        if (!login || !password)
            return res.status(400).json({
                error: "All fields must be filled!",
                fields: [
                    'loginLogin',
                    'loginPassword',
                ]
            });
        const user = await User.findOne({ login });
        if (!user)
            return res.status(400).json({
                error: "Login or password fields are incorrect!",
                fields: [
                    'loginLogin',
                    'loginPassword',
                ]
            });
        req.body.user = user;
        if (!bcrypt.compareSync(password, user.password))
            return res.status(400).json({
                error: "Login or password fields are incorrect!",
                fields: [
                    'loginLogin',
                    'loginPassword',
                ]
            });
        next();
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {
    registration,
    login
}
