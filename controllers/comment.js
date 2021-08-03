const express = require('express');
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Comment = require('../models/comment.js');

class Controller {
    async add(req, res) {
        try {
            const {userId, userLogin} = req.session;
            if(!userId || !userLogin)
                return res.redirect('/');
            const { body, post } = req.body;
            if(!body)
                return res.status(400).json({
                    error: 'All fields must be filled!'
                });
            const checkPost = await Post.findOne({_id: post});
            if(!checkPost)
                return res.redirect('/');
            const comment = await Comment.create({
                body,
                post,
                owner: userId
            });
            return res.json({
                login: checkPost.owner.login,
                url: checkPost.url
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async delete(req, res) {
        try {
            const {userId, userLogin} = req.session;
            if(!userId || !userLogin)
                return res.redirect('/');
            const { comment } = req.body;
            if(!comment)
                return res.status(400).redirect('/').json({
                    error: 'Comment error!!'
                });
            const checkComment = await Comment.findOne({_id: comment});
            if(!checkComment)
                return res.status(400).redirect('/').json({
                    error: 'Wrong comment id!'
                });
            if(userLogin !== checkComment.owner.login)
                return res.status(400).redirect('/').json({
                    error: 'You do not have sufficient rights to carry out this operation!'
                });
            checkComment.remove();
            return res.json({});
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new Controller();