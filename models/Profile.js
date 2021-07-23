const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }, 
    bio: {
        type: String, 
    }, 
    backgroundPicture: {
        type: String, 
        default: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1502&q=80'
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);