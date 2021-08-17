const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');
const Comment = require('../models/Comment');
const Answer = require('../models/Answer');
const User = require('../models/User');

// @route   GET /questions
// @desc    Get all questions
// @access  Public

router.get('/', [], async (req, res) => {
    // request example: /questions/?page=1&limit=10
    const page = parseInt(req.query.page) || 0; 
    const limit = parseInt(req.query.limit) || 10; 
    
    try{
       await Question.find()
        .sort({ date: -1})
        .skip(page*limit)
        .limit(limit)
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
        .exec(async (err, questions) => {
            if(err) {
                return res.status(500).send({ error: 'Server Error'}); 
            }
            await Question.countDocuments({}).exec((countErr, count) => {
                if(err){
                    return res.json([]); 
                }
                return res.json({
                    total: count, 
                    page, 
                    pageSize: questions.length, 
                    questions
                 }); 
            }); 
        }); 
    } catch (err) {
        console.error(err.message);
        res.json(500).send({error: 'Server Error'});
    }
});

// @todo
// @route   GET /questions/user 
// @desc   Get questions that belong to spaces that a user is part of. 
// @access  Private 


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
                    select: ['fullName', 'avatar']
                }
            }, 
            {
                path: 'answers', 
                model: Answer, 
                populate: {
                    path: 'creator', 
                    model: User, 
                    select: ['fullName', 'avatar']
                }
            }]
        ).exec()
        .then( question => {
            if(!question){
                return res.status(404).send({ error: 'Question not found'});
            }
            res.json(question);
        });
    } catch (err){
        if(err.kind == "ObjectId"){
            return res.status(404).send({ error: 'Question not found'});
        }
        console.error(err.message); 
        res.status(500).send({error: 'Server Error'});
    }
});

// @route   POST /questions/:question_id/comments
// @desc    Post a comment to a question
// @access  Private (user must be logged in)

router.post('/:question_id/comments', [auth, [
    check('text', 'Comment text is required')
    .not()
    .isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    try {
        const question = await Question.findOne({ _id: req.params.question_id });

        if(!question){
            return res.status(404).send({ error: 'Question not found'});
        }

        const commentText = {
            text: req.body.text, 
            creator: req.user.id
        };

        let comment = new Comment(commentText);
        await comment.save();
        
        question.comments.push(comment);
        await question.save()

        res.json({msg: 'Comment posted'});
    } catch(err){
        if (err.kind == "ObjectId"){
            return res.status(404).send({error: 'Question not found'})
        }
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
});

module.exports = router;