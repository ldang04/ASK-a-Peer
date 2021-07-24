const mongoose = require('mongoose'); 

const SpaceSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        unique: true
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
    ], 
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
    ],
    moderators: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
    ], 
    modNames: [
        {
            type: String
        }
    ],
    modAvatars: [
        {
            type: String
        }
    ], 
    modLinks : [
        {
            type: String
        }
    ], 
    members: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
    ], 
    backgroundPicture: {
        type: String, 
        default: 'https://images.unsplash.com/photo-1485627941502-d2e6429a8af0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
    }
});

module.exports = Space = mongoose.model('space', SpaceSchema);