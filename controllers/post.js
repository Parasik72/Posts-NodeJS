const express = require('express');
const User = require('../models/user.js');
const Post = require('../models/post.js');
const Upload = require('../models/upload.js');
const Comment = require('../models/comment.js');
const moment = require('moment');
const mkdirp = require('mkdirp');
const diskStorage = require('../utils/diskStorage.js');
const path = require('path');
const Sharp = require('sharp');
const multer = require('multer');
const config = require('../config.js');
const fs = require('fs')

moment.locale('us');

const randStr = () => Math.random().toString(36).slice(-6);

const createDir = async (req) => {
    let dir = `/${randStr()}/${randStr()}`;
    const checkDir = await Upload.find({
        owner: req.session.userId,
        dir
    });
    if(checkDir.length)
        dir = await createDir(req);
    return dir;
}

const storage = diskStorage({
    destination: async (req, file, cb) => {
        const dir = await createDir(req);
        req.dir = dir;
        mkdirp.sync(`${config.DESTINATION}/${dir}`);
        cb(null, `${config.DESTINATION}/${dir}`);
    },
    filename: async (req, file, cb) => {
        const {userId, userLogin} = req.session;
        const fileName = Date.now().toString(36) + path.extname(file.originalname);
        const { dir } = req;
        const upload = await Upload.create({
            path: `${dir}/${fileName}`,
            owner: userId,
            dir: req.dir
        });
        req.filePath = `${dir}/${fileName}`;
        req.fileId = upload._id;
        cb(null, fileName);
    },
    sharp: (req, file, cb) => {
        const resizer = Sharp()
            .resize(1024, 768)
            .toFormat('jpg')
            .jpeg({
                quality: 40,
                progressive: true
            });
        cb(null, resizer);
    }
});

const upload = multer({
    storage,
    limits:{
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            const err = new Error('Bad Format');
            err.code = 'BAD_FORMAT';
            return cb(err);
        }
        cb(null, true);
    }
}).single('file');

class Controller {
    async homePage(req, res) {
        try {
            const { userId, userLogin } = req.session;
            const posts = await Post.find()
                .sort({ createdAt: -1 })
                .populate('images');
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
            const uploads = await Upload.find({owner: userId, isPublished: false});
            if(uploads){
                uploads.forEach(async upload => {
                    fs.unlink(`${config.DESTINATION}${upload.path}`, err => { if(err) console.log(err); });
                    fs.rmdirSync(`${config.DESTINATION}/${upload.path.split('/')[1]}`, {recursive: true});
                    await upload.remove()
                });
            }
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
            const images = await Upload.find({
                owner: userId,
                isPublished: false
            });
            images.forEach(image => {
                image.isPublished = true;
                image.save();
            });
            const post = await Post.create({
                title,
                body,
                owner: userId,
                images
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
            const checkPost = await Post
                .findById(post)
                .populate('images');
            if(!checkPost)
                return res.status(400).redirect('/').json({
                    error: 'Wrong post id!'
                });
            if(checkPost.owner.login !== userLogin)
                return res.status(400).redirect('/').json({
                    error: 'You do not have sufficient rights to carry out this operation!'
                });
            const comments = await Comment.find({post}).deleteMany();
            if(checkPost.images){
                checkPost.images.forEach(async upload => {
                    fs.unlink(`${config.DESTINATION}${upload.path}`, err => { if(err) console.log(err); });
                    fs.rmdirSync(`${config.DESTINATION}/${upload.path.split('/')[1]}`, {recursive: true});
                    await upload.remove()
                });
            }
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
            const userPost = await Post
                .findOne({ url: post })
                .populate('images');
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
                .sort({ createdAt: -1 })
                .populate('images');
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

    async uploadImg(req, res){
        try {
            upload(req, res, err => {
                let errorCode = '';
                if(err){
                    if(err.code === 'LIMIT_FILE_SIZE')
                        errorCode = 'Image size must be not more than 2mb!'
                    if(err.code === 'BAD_FORMAT')
                        errorCode = 'Image type must be .png, .jpg and .jpeg!';
                }
                if(errorCode === '' && req.filePath && req.fileId)
                    return res.json({
                        filePath: req.filePath,
                        fileId: req.fileId
                    });
                return res.status(400).json({
                    error: errorCode
                })
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new Controller();