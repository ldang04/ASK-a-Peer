const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, 
    description: {
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
        type: String, 
    },
    avatar: {
        type: String
    },
    date: {
        type: Date, 
        default: Date.now
    },
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
    ],
    comments: [
        {
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
        }
    ]
});

module.exports = Answer = mongoose.model('answer', AnswerSchema);