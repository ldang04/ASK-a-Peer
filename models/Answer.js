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
    date: {
        type: Date, 
        default: Date.now
    },
    upvotes: [
        {
            user: mongoose.Schema.Types.ObjectId, 
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