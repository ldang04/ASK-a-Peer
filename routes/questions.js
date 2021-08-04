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
        if(err.kind == 'ObjectId'){
            return res.json([]);
        }
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

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

        const commentText = {
            text: req.body.text, 
            creator: req.user.id
        };

        let comment = new Comment(commentText);
        await comment.save();
        
        question.comments.push(comment);
        await question.save()

        res.json(question);
    } catch(err){
        if (err.kind == "ObjectId"){
            return res.status(400).send({error: 'Question not found'})
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE questions/:question_id/comments/:comment_id
// @desc    Delete a comment in a question
// @access  Private (user must be logged in)

router.delete('/:question_id/comments/:comment_id', auth, async(req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        const question = await Question.findOne({ _id: req.params.question_id });
        let comment = await Comment.findOne({ _id: req.params.comment_id });

        if(!question) {
            return res.status(400).send('Question not found');
        }
        
        if(!comment){
            return res.status(400).send('Comment not found');
        }

        if(!question.comments.includes(comment._id)){
            return res.status(400).send('This comment does not belong to the given question. Check browser URL.');
        }

        if(req.user.id == comment.creator || space.moderators.includes(req.user.id) || user.admin){
            const commentIndex = question.comments.indexOf(req.params.comment_id);
            question.comments.splice(commentIndex, 1);
            
            await Comment.findOneAndRemove({ _id: req.params.comment_id });
            await question.save();
    
            res.json('Comment deleted');
        } else {
            res.status(400).send('Comment delete access unauthorized');
        }
        
    } catch (err) {
        if(err.kind == "ObjectId"){
            return res.status(400).send({ error: "Comment not found"});
        }

        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;