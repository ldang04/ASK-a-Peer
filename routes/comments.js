const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');
const Comment = require('../models/Comment');
const Answer = require('../models/Answer');
const User = require('../models/User');

// @route   POST /comments/:comment_id/vote
// @desc    Upvote/downvote a comment 
// @access  Private (user must be logged in)

router.post('/:comment_id/vote', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 
        const comment = await Comment.findOne({ _id: req.params.comment_id}); 

        if(!comment){
            return res.status(404).send({ error: 'Comment not found'});
        }
        
        // Check if user has already upvoted comment 
        if(comment.upvotes.includes(user._id)){ // if already upvoted, downvote
            const userIndex = comment.upvotes.indexOf(user._id); 
            comment.upvotes.splice(userIndex, 1); 
            await comment.save(); 
            res.json({msg: 'Comment downvoted'});
        } else { // if hasn't upvoted, upvote
            comment.upvotes.push(user._id); 
            await comment.save(); 
            res.json({msg: 'Comment upvoted'});
        }
    } catch (err){
        if(err.kind == 'ObjectId'){
            return res.status(404).send({ error: 'Comment not found '}); 
        }
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
}); 

module.exports = router;