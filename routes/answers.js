const express = require('express');
const router = express.Router();

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

// @todo test
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
                return res.status(400).send({ error: 'Answer not found' });
            }
            res.json(answer);
        })
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;