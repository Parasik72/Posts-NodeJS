//@ts-check
const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

class Controller{
    async registration(req, res){
        try {
            const { login, password } = req.body;
            const hashPassword = bcrypt.hashSync(password, 8);
            const newUser = await User.create({
                login,
                password: hashPassword
            });
            req.session.userId = newUser._id;
            req.session.userLogin = newUser.login;
            return res.status(200).json(newUser);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    
    async login(req, res){
        try {
            const { user } = req.body;
            req.session.userId = user._id;
            req.session.userLogin = user.login;
            return res.status(200).json({user});
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async logout(req, res){
        try {
            if(req.session)
                req.session.destroy(()=>{});
            return res.redirect('/');
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new Controller();