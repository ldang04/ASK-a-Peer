const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String, 
        required: true
    }, 
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }, 
    creatorName: {
        type: String
    },
    creatorLink: {
        type: String
    },
    avatar: {
        type: String
    },
    dateCreated: {
        type: Date, 
        default: Date.now
    }, 
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
    ]
});

module.exports = Comment = mongoose.model('comment', CommentSchema);
