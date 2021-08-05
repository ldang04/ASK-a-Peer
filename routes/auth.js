const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   POST /auth
// @desc    Authenticate user and get token
// @access  Public
router.post('/', [ // validate that required fields are filled. 
    check('email', 'Please enter a valid email')
    .isEmail(), 
    check('password', 'Password is required')
    .exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ // if errors are present in request
        return res.status(400).json({ errors: errors.array()}); // status 400: bad request
    }

    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({ email: email });

        // See if user exists
        if(!user){
            return res.status(400).json({ error: 'Invalid credentials'});
        }

        // See if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ errors: 'Invalid credentials'});
        }

        // Return jsonwebtoken 
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            { expiresIn: 10800 }, // expires every three hours 
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

module.exports = router;