const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
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
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'answer'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'comment'
        }
    ]
});

module.exports = Question = mongoose.model('question', QuestionSchema);