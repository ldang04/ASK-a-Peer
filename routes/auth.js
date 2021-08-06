const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');

// @route   POST auth/register
// @desc    Register a user 
// @access  Public

router.post('/register', [ // validate that required fields are filled. 
    check('fullName', 'Full name is required')
    .not()
    .isEmpty(),
    check('email', 'Please enter a valid email')
    .isEmail(), 
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ // if errors are present in request
        return res.status(400).json({ errors: errors.array()}); 
    }

    const { fullName, email, password } = req.body;
    
    try {
        // See if user exists 
        let user = await User.findOne({ email: email });

        if(user){
            return res.status(400).json({ error: 'User already exists'});
        }

        user = new User({
            fullName,
            email, 
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
            { expiresIn: '1d' }, 
            async (err, token) => {
                if(err) throw err; 

                const emailBody = `
                    <p> Thanks for joining ASK-a-Peer! We're glad to have you as a member of our peer tutoring platform :)  
                    </p> 

                    <p>
                    Please confirm your email address by clicking the link below: 
                    </p>

                    <a href="http://localhost:5000/auth/confirmation/${token}"> Verify Account </a>

                    <p> <b> Important: This link will expire within 24 hours. </b> </p>
                    
                `
                // Send account verification email
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true, 
                    auth: {
                        user: 'askapeer.andover@gmail.com', 
                        pass: config.get('emailPass'), 
                    }
                });
        
                let info = await transporter.sendMail({
                from: '"ASK-a-Peer" <askapeer.andover@gmail.com>', 
                to: email, 
                subject: "ASK-a-Peer: Confirm your email address", 
                html: emailBody,
                });
            }
        );
        res.json('Confirmation email sent');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /auth/confirmation/:token
// @desc    Authenticate user and get token
// @access  Public

router.get('/confirmation/:token', async (req, res) => {
    try {  
        const { user: { id }} = jwt.verify(req.params.token, config.get('jwtSecret')); 
        await User.findOneAndUpdate(
            { _id: id}, 
            { $set: {emailVerified: true }}
        ); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    return res.redirect('/auth/login');
}); 

// @route   POST /auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', [ // validate that required fields are filled. 
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

        // See if user is confirmed 
        if(!user.emailVerified){
            return res.status(400).send({ error: 'User email has not been verified. Check inbox for email confirmation link and follow steps to login.'}); 
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