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
        // @todo deep populate questions and answers with creator names and comments
        await Space.findOne({ _id: req.params.space_id })
        .populate(
            [
                {
                    path: 'questions', 
                    model: Question, 
                    populate: [
                        {
                            path: 'answers', 
                            model: Answer,
                            populate: [
                                {
                                    path: 'creator', 
                                    model: User, 
                                    select: ['username', 'avatar']
                                }, 
                                {
                                    path: 'comments', 
                                    model: Comment, 
                                    populate: {
                                        path: 'creator', 
                                        model: User, 
                                        select: ['username', 'avatar']
                                    }
                                }
                            ]
                        }, 
                        {
                            path: 'comments', 
                            model: Comment, 
                            populate: {
                                path: 'creator', 
                                model: User, 
                                select: ['username', 'avatar']
                            }
                        }
                    ]
                }
            ]
        )
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

module.exports = router;