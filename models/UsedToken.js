const mongoose = require('mongoose');

const UsedTokenSchema = new mongoose.Schema({
    token: {
        type: String
    }
}); 

module.exports = UsedToken = mongoose.model('usedToken', UsedTokenSchema); 