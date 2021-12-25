const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Question = require('../models/Question'); 
const Answer = require('../models/Answer')
const Comment = require('../models/Comment');
const Space = require('../models/Space');

// @route   GET /users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).select('-password');

        // Build response object 
        const response = {}; 
        response._id = user._id; 
        response.fullName = user.fullName; 
        response.email = user.email; 
        response.avatar = user.avatar; 
        response.pronouns = user.pronouns; 
        response.admin = user.admin; 
        response.bio = user.bio; 
        
        // Spaces 
        const spaces = await Space.find({ members: user._id }).select(['title']);

        if(spaces){
            response.spaces = spaces; 
        }

        // Questions 
       await Question.find({ creator: { _id: user._id }})
        .populate(
            [
                {
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
            }
        ]
    )
    .exec()
    .then( questions => {
        if(!questions){
            return res.status(400).send({ error: 'Something went wrong. No questions can be found at this time.'}); 
        }
        response.questions = questions; 
    }); 
        // Answers
    await Answer.find({ creator: {_id: user._id }})
    .populate(
        {
            path: 'comments', 
            model: Comment, 
            populate: {
                path: 'creator', 
                model: User, 
                select: ['fullName', 'avatar']
            }
        }
    )
    .exec()
    .then(answers => {
        if(!answers){
            return res.status(400).send({ error: 'Something went wrong. No answers can be found at this time.'})
        }
        response.answers = answers;
    });
    res.json(response);

    } catch (err) {
        console.log('catch')
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
});

// @route   POST /users/me
// @desc    Update user info
// @access  Private

router.post('/me', auth , async (req, res) => {
    const {
        password,
        avatar, 
        pronouns,
        bio, 
    } = req.body; 

    // Build user object 
    const userFields = {}; 
    userFields.user = req.user.id; 
    
    if(password){
        const salt = await bcrypt.genSalt(10);

        let hashedPassword = await bcrypt.hash(password, salt);
        userFields.password = hashedPassword; 
    }
    if(avatar) userFields.avatar = avatar;
    if(pronouns) userFields.pronouns = pronouns; 
    if(bio) userFields.bio = bio; 

    try {
        let user = await User.findOne({ _id: req.user.id });

        // Update the user
         user = await User.findOneAndUpdate(
            { _id: req.user.id }, 
            { $set: userFields }, 
            { new: true }
         );

         user = await User.findOne({ _id: req.user.id }).select('-password');
            
         return res.json({msg: 'User updated'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
});

// @route   GET /users/:user_id
// @desc    Get another user's account by user id (get answers and user info)
// @access  Public

router.get('/:user_id', async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.params.user_id }).select('-password');
        
        if(!user){
            return res.status(404).send({ error: 'User not found'});
        }
    
        // Build response object 
        const response = {}; 
        response._id = user._id; 
        response.fullName = user.fullName; 
        response.email = user.email; 
        response.avatar = user.avatar; 
        response.pronouns = user.pronouns; 
        response.admin = user.admin; 
        response.bio = user.bio; 
        
        // Spaces 
        const spaces = await Space.find({ members: user._id }).select(['title']);

        if(spaces){
            response.spaces = spaces; 
        }

        // Answers
        await Answer.find({ creator: {_id: user._id }})
        .populate(
            {
                path: 'comments', 
                model: Comment, 
                populate: {
                    path: 'creator', 
                    model: User, 
                    select: ['fullName', 'avatar']
                }
            }
        )
    .exec()
    .then(answers => {
        response.answers = answers;
    });
    
    res.json(response);
    } catch(err) {
        // Handle if user isn't found
        if (err.kind == 'ObjectId') return res.status(404).json({ error: 'User not found '}); 
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
});

module.exports = router;