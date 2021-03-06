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
            return res.status(400).send({error: 'Something went wrong. No spaces can be found at this time'});
        }
        
        // Sort spaces in alphabetical order
        let sortedSpaces = spaces.sort((a, b) => {
            if(a.title < b.title) return -1; 
            if(a.title > b.title ) return 1;
            return 
        });
        res.json(sortedSpaces);
    } catch (err){
        console.error(err.message);
        res.json(500).send({error: 'Server error'});
    }
});

// @route   GET /spaces/:space_id
// @desc    Get a space by space id
// @access  Public

router.get('/:space_id', async (req,res) => {
    try {
        
        await Space.findOne({ _id: req.params.space_id })
        // TODO: paginate questions, and filter to only questions with answers 
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
                            ]
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
                    ]
                }
            ]
        )
        .populate('admins', ['fullName', 'email', 'avatar', 'pronouns'])
        .populate('moderators', ['fullName', 'email', 'avatar', 'pronouns'])
        .populate('members', ['fullName', 'email', 'avatar', 'pronouns'])
        .exec()
        .then( space => {
            if(!space){
                return res.status(404).send({error: 'Space not found'});
            }
            res.json(space);
        });
    } catch (err) {
        // Handle if space isn't found 
        if(err.kind == "ObjectId"){
            return res.status(404).send({error: 'Space not found'});
        }
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
});

module.exports = router;