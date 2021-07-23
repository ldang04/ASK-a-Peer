const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Profile = require('../models/Profile');

// @route   POST /users
// @desc    Register a user and create default profile
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

        // Create new user profile
        try {
            const defaultProfile = {
                user: user.id, 
            }; 

            const profile = new Profile(defaultProfile);
            await profile.save();
        } catch (err) {
            console.log(err);
        }
    

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;