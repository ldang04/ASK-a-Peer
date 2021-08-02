const express = require('express');
const router = express.Router();

const Question = require('../models/Question');
const Comment = require('../models/Comment');
const Answer = require('../models/Answer');
const User = require('../models/User');

// @route   GET /questions
// @desc    Get all questions
// @access  Public

router.get('/', [], async (req, res) => {
    try{
       await Question.find().sort({ date: -1})
        .populate(
                [
                    {
                    path: 'comments', 
                    model: Comment, 
                    populate: {
                        path: 'creator', 
                        model: User, 
                        select: ['username', 'avatar']
                    }
                }, 
                {
                    path: 'answers', 
                    model: Answer, 
                    populate: {
                        path: 'creator', 
                        model: User
                    }
                }
            ]
        )
        .exec()
        .then( questions => {
            if(!questions){
                return res.json([]);
            }
            res.json(questions);
        })
    } catch (err) {
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

// @todo 
// @route   GET /questions/:question_id
// @desc    Get question by question id 
// @access  Public

router.get('/:question_id', async (req, res) => {
    try {
        await Question.findOne({ _id: req.params.question_id})
        .populate(
            [{
                path: 'comments', 
                model: Comment, 
                populate: {
                    path: 'creator', 
                    model: User, 
                    select: ['username', 'avatar']
                }
            }, 
            {
                path: 'answers', 
                model: Answer, 
                populate: {
                    path: 'creator', 
                    model: User, 
                    select: ['username', 'avatar']
                }
            }]
        ).exec()
        .then( question => {
            if (!question){
                return res.status(400).send({ error: 'Question not found'});
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