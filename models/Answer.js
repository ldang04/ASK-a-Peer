const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({
    questionName: {
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
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
    ],
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId, 
           ref: 'comment'
        }
    ]
});

module.exports = Answer = mongoose.model('answer', AnswerSchema);