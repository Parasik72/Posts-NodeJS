const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const comment = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Post'
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

comment.plugin(autopopulate);

module.exports = mongoose.model('Comment', comment);