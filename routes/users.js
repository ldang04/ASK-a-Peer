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
        response.backgroundPicture = user.backgroundPicture;
        
        // Spaces 
        const spaces = await Space.find({ members: user._id }).select(['title', 'backgroundPicture']);

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
        response.answers = answers;
    });
    
    res.json(response);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
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
        backgroundPicture
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
    if(backgroundPicture) userFields.backgroundPicture = backgroundPicture; 

    try {
        let user = await User.findOne({ _id: req.user.id });

        // Update the user
         user = await User.findOneAndUpdate(
            { _id: req.user.id }, 
            { $set: userFields }, 
            { new: true }
         );

         user = await User.findOne({ _id: req.user.id }).select('-password');
            
         return res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /users/:user_id
// @desc    Get another user's account by user id (get answers and user info)
// @access  Public

router.get('/:user_id', async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.params.user_id }).select('-password');
        
        if(!user){
            return res.status(400).send({ error: 'User not found'});
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
        response.backgroundPicture = user.backgroundPicture;
        
        // Spaces 
        const spaces = await Space.find({ members: user._id }).select(['title', 'backgroundPicture']);

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
        if (err.kind == 'ObjectId') return res.status(400).json({ error: 'User not found '})
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /users
// @desc    Delete a user account 
// @access  Private

router.delete('/', auth, async (req,res) => {
    try {
        // Delete user
        await User.findOneAndRemove({ _id: req.user.id });

        // @todo make json webtoken invalid
        res.json({ msg: 'User deleted' });

    } catch (err) {
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

module.exports = router;