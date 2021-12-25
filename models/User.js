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
    }
});

module.exports = User = mongoose.model('user', UserSchema);