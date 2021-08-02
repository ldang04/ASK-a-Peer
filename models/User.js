const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    }, 
    fullName: {
        type: String, 
        required: true
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
    pronouns: {
        type: String,
    },
    admin: {
        type: Boolean
    }, 
    bio: {
        type: String
    }, 
    backgroundPicture: {
        type: String, 
        default: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1502&q=80'
    }
});

module.exports = User = mongoose.model('user', UserSchema);