const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const UrlSlugs = require('mongoose-url-slugs');
const tr = require('transliter');

const post = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    images: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Upload'
    }]
}
    ,
    {
        timestamps: true
    }
);

post.plugin(UrlSlugs('title', {
    field: 'url',
    generator: text => tr.slugify(text)
}));

post.plugin(autopopulate);

module.exports = mongoose.model('Post', post);