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
            answer: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'answer'
            }
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

module.exports = Question = mongoose.model('question', QuestionSchema);