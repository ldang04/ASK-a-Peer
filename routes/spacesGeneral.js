const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');

// @route   GET /spaces
// @desc    Get all spaces
// @access  Public
router.get('/', async (req, res) => {
    try {
        const spaces = await Space.find(); 
        if(!spaces){
            return res.status(400).send({error: 'No spaces found'});
        }
        res.json(spaces);
    } catch (err){
        console.error(err.message);
        res.json(500).send('Server error');
    }
});

// @todo 
// @route   GET /spaces/:space_id
// @desc    Get a space by space id
// @access  Public

router.get('/:space_id', async (req,res) => {
    try {
        // @todo populate space with questions + users
        await Space.findOne({ _id: req.params.space_id })
        .populate(['questions', 'answers'])
        .populate('admins', ['username', 'fullName', 'email', 'avatar', 'pronouns'])
        .populate('moderators', ['username', 'fullName', 'email', 'avatar', 'pronouns'])
        .populate('members', ['username', 'fullName', 'email', 'avatar', 'pronouns'])
        .exec()
        .then( space => {
            if(!space){
                return res.status(400).send({error: 'Space not found'});
            }
            res.json(space);
        });
        
    } catch (err) {
        // Handle if space isn't found 
        if(err.kind == "ObjectId"){
            return res.status(400).send({error: 'Space not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @todo 
// @route   GET /spaces/:space_id/questions/:question_id
// @desc    Get question by question id 
// @access  Public

router.get('/:space_id/questions/:question_id', async (req, res) => {
    try {
        // @todo populate the question with comments and answers information
        await Question.findOne({ _id: req.params.question_id})
        .populate(['answers', 'comments'])
        .populate('creator', ['username', 'fullName', 'email', 'avatar', 'pronouns'])
        .exec()
        .then(question => {
            if(!question) {
                return res.status(400).send({ error: 'Question not found' });
            }
            res.json(question);
        });
    } catch (err){
        if(err.kind == "ObjectId"){
            return res.status(400).send({ error: 'Question not found'});
        }
        console.error(err.message); 
        res.status(500).send('Server Error');
    }
});

module.exports = router;