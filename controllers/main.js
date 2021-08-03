//@ts-check
const express = require('express');
const Post = require('../models/post.js');
const User = require('../models/user.js');

class Controller {
    // async homePage(req, res) {
    //     try {
    //         const { userId, userLogin } = req.session;
    //         const posts = await Post.find()
    //             .sort({ createdAt: -1 });
    //         return res.render('index', {
    //             posts,
    //             user: {
    //                 id: userId,
    //                 login: userLogin
    //             }
    //         });
    //     } catch (error) {
    //         return res.status(500).json(error);
    //     }
    // }
}

module.exports = new Controller();