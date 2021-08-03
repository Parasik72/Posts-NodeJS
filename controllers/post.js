const express = require('express');
const User = require('../models/user.js');
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');
const moment = require('moment');

moment.locale('us');

class Controller {
    async homePage(req, res) {
        try {
            const { userId, userLogin } = req.session;
            const posts = await Post.find()
                .sort({ createdAt: -1 });
            return res.render('index', {
                posts,
                user: {
                    id: userId,
                    login: userLogin
                },
                currentUrl: 'posts'
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async creatingPost(req, res) {
        try {
            const { userId, userLogin } = req.session;
            if (!userId || !userLogin)
                return res.redirect('/');
            const currentUrl = req.url.split('/');
            return res.render('add', {
                user: {
                    login: userLogin,
                    id: userId
                },
                currentUrl: currentUrl[currentUrl.length - 1]
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async addPost(req, res) {
        try {
            const { userId, userLogin } = req.session;
            if (!userId || !userLogin)
                return res.redirect('/');
            const { title, body } = req.body;
            if (!title || !body)
                return res.status(400).redirect('/').json({
                    error: 'All fields must be filled!'
                });
            const post = await Post.create({
                title,
                body,
                owner: userId
            });
            if (!post)
                return res.status(400).json({
                    error: 'Post creating failed!'
                });
            return res.redirect('/posts');
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async deletePost(req, res){
        try {
            const { userId, userLogin } = req.session;
            if (!userId || !userLogin)
                return res.redirect('/');
            const { post } = req.body;
            const checkPost = await Post.findById(post);
            if(!checkPost)
                return res.status(400).redirect('/').json({
                    error: 'Wrong post id!'
                });
            if(checkPost.owner.login !== userLogin)
                return res.status(400).redirect('/').json({
                    error: 'You do not have sufficient rights to carry out this operation!'
                });
            const comments = await Comment.find({post}).deleteMany();
            checkPost.remove();
            return res.json({});
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async post(req, res) {
        try {
            const { userId, userLogin } = req.session;
            const { login, post } = req.params;
            const user = await User.findOne({ login });
            if (!user)
                return res.redirect('/');
            const userPost = await Post.findOne({ url: post });
            if (!userPost)
                return res.redirect('/');
            const comments = await Comment
                .find({ post: userPost._id })
                .sort({ createdAt: -1 });
            const currentUrl = req.url.split('/');
            return res.render('user/post', {
                post: userPost,
                comments,
                moment,
                user: {
                    id: userId,
                    login: userLogin
                },
                currentUrl: currentUrl[currentUrl.length - 1]
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async posts(req, res) {
        try {
            const { userId, userLogin } = req.session;
            const { login } = req.params;
            const user = await User.findOne({ login });
            if (!user)
                return res.redirect('/');
            const posts = await Post.find({
                owner: user._id
            })
                .sort({ createdAt: -1 });
            const currentUrl = req.url.split('/');
            return res.render('user/posts', {
                posts,
                owner: user,
                user: {
                    id: userId,
                    login: userLogin
                },
                currentUrl: currentUrl[currentUrl.length - 1]
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new Controller();