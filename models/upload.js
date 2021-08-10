const mongoose = require('mongoose');

const upload = mongoose.Schema({
    path:{
        type: String,
        required: true,
    },
    dir:{
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Upload', upload);