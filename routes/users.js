const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');

// @route   POST /users
// @desc    Register a user 
// @access  Public

router.post('/', [ // validate that required fields are filled. 
    check('username', 'Username is required')
    .not()
    .isEmpty(), 
    check('email', 'Please enter a valid email')
    .isEmail(), 
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ // if errors are present in request
        return res.status(400).json({ errors: errors.array()}); // status 400: bad request
    }

    const { username, email, password } = req.body;
    
    try {
        // See if user exists 
        let user = await User.findOne({ email: email });

        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists' }]});
        }

        user = await User.findOne({ username }); 

        if(user){
            return res.status(400).json({ errors: [{ msg: 'Username taken' }]});
        }

        // Get users' gravatar 
        const avatar = gravatar.url(email, {
            s: '200', 
            r: 'pg', 
            d: 'mm'
        });

        user = new User({
            username, 
            email, 
            avatar, 
            password
        }); 

        // Encrypt password 
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return jsonwebtoken 
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            { expiresIn: 259200 }, // expires every three hours (configured to 3 days for dev purposes)
            (err, token) => {
                if(err) throw err; 
                res.json({ token }); // returns webtoken
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // @todo: populate user with spaces and posts. 
        const user = await User.findOne({ _id: req.user.id }).select('-password'); 

        // if no user
        if (!user){
            return res.status(400).json({ errors: [{msg: 'This user does not exist'}]});
        }

        res.json(user);
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /users/me
// @desc    Update a user 
// @access  Private

router.post('/me', auth , async (req, res) => {
    const {
        username, 
        avatar, 
        pronouns,
        bio, 
        backgroundPicture
    } = req.body; 

    // Build user object 
    const userFields = {}; 
    userFields.user = req.user.id; 
    
    if(username) userFields.username = username; 
    if(avatar) userFields.avatar = avatar;
    if(pronouns) userFields.pronouns = pronouns; 
    if(bio) userFields.bio = bio; 
    if(backgroundPicture) userFields.backgroundPicture = backgroundPicture; 

    try {
        let user = await User.findOne({ _id: req.user.id });

        // Verify that user exists 
        if(!user) {
            return res.status(400).send({errors: [{ msg: 'User not found'}]});
        }


        //Update the user
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
// @desc    Get another user's account by user id
// @access  Public

router.get('/:user_id', async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.params.user_id }).select('-password');
        res.json(user);
        
    } catch(err) {
        // Handle if user isn't found
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'User not found '})
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
        res.json({ msg: 'User deleted' });

    } catch (err) {
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

// @route   GET /users/:user_id/spaces
// @desc    Get all spaces belonging to the user
// @access  Public

router.get('/:user_id/spaces', async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.user_id });
        res.json(user.spaces);

    } catch (err){
        // Handle if user isn't found
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'User not found '});
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /users/:users_id/questions
// @desc    Get all questions belonging to a user
// @access  Public

router.get('/:user_id/questions', async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.user_id });
        res.json(user.questions);

    } catch (err){
        // Handle if user isn't found
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'User not found '})
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /users/:users_id/answers
// @desc    Get all answers belonging to a user
// @access  Public

router.get('/:user_id/answers', async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.user_id });
        res.json(user.answers);

    } catch (err){
        // Handle if user isn't found
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'User not found '})
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;