const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    emailVerified: {
        type: Boolean, 
        default: false
    }, 
    avatar: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
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