const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Space = require('../models/Space');
const Comment = require('../models/Comment');
const { json } = require('express');

// @route   GET /answers
// @desc    Get all answers
// @access  Public

router.get('/', async (req, res) => {
    try {
        const answers = await Answer.find(); 
        res.json(answers);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /answers/:answer_id
// @desc    Get answer by answer id 
// @access  Public

router.get('/:answer_id', async (req, res) => {
    try {
        await Answer.find({_id: req.params.answer_id})
        .populate([
            {
                path: 'creator', 
                model: User, 
                select: ['fullName', 'avatar']
            }, 
            {
                path: 'comments', 
                model: Comment, 
                populate: {
                    path: 'creator', 
                    model: User, 
                    select: ['fullName', 'avatar']
                }
            }
        ])
        .exec()
        .then(answer => {
            if(!answer){
                return res.status(400).send({ error: 'Answer not found'});
            }
            res.json(answer);
        }); 
    } catch (err){
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Answer not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /answers/:answer_id
// @desc    Edit an answer
// @access  Private (mod creator access)

router.post('/:answer_id', auth, async(req, res) => {
    try {
        let answer = await Answer.findOne({ _id: req.params.answer_id });

        if(!answer){
            return res.status(400).send({ error: 'Answer not found'});
        }

        if(req.user.id == answer.creator){
            const edit = {}; 
            if(req.body.description) edit.description = req.body.description; 

            answer = await Answer.findOneAndUpdate(
                { _id: req.params.answer_id }, 
                { $set: edit }, 
                { new: true }
            ); 

            await answer.save();
            res.json(answer);
        } else {
            res.status(400).send({ error: 'Creator access is required to edit answer'});
        }

    } catch (err) {
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Answer not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /answers/:answer_id/comments
// @desc    Post a comment to an answer
// @access  Private (user must be logged in)

router.post('/:answer_id/comments', [auth, [
    check('text', 'Comment text is required')
    .not()
    .isEmpty()
]], async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).send({ error: error.errors[0].msg}); 
    }
    const { text } = req.body; 
    try {
        const answer = await Answer.findOne({ _id: req.params.answer_id}); 

        if(!answer){
            return res.status(400).send({ error: 'Answer not found'});
        }

        const commentFields = {}; 
        commentFields.text = text; 
        commentFields.creator = req.user.id; 
        
        let comment = new Comment(commentFields); 
        
        answer.comments.push(comment);
        
        await comment.save(); 
        await answer.save();
        res.json(answer);
    } catch (err){
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Answer not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /answers/:answer_id/vote
// @desc    Upvote/downvote an answer
// @access  Private (user must be logged in)

router.post('/:answer_id/vote', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 
        const answer = await Answer.findOne({ _id: req.params.answer_id}); 
        
        if(!answer){
            return res.status(400).send({ error: 'Answer not found'}); 
        }
        
        if(answer.upvotes.includes(user._id)){
            const userIndex = answer.upvotes.indexOf(user._id);
            answer.upvotes.splice(userIndex, 1);
            await answer.save(); 
            res.json(answer);
        } else {
            answer.upvotes.push(user._id);
            await answer.save();
            res.json(answer);
        }
    } catch (err) {
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Answer not found'})
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); 

module.exports = router;