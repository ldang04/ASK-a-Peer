const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    }, 
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    }, 
    avatar: {
        type: String
    },
    admin: {
        type: Boolean
    }, 
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'question'
        }
    ], 
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'answer'
        }
    ]
});

module.exports = User = mongoose.model('user', UserSchema);