const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const UsedToken = require('../models/UsedToken');

// @route   POST auth/register
// @desc    Register a user 
// @access  Public

router.post('/register', [ // validate that required fields are filled. 
    check('fullName', 'Please enter your full name')
    .not()
    .isEmpty(),
    check('email', 'Please enter a valid email')
    .isEmail(), 
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ // if errors are present in request
        return res.status(400).send({ errors: errors.array()}); 
    }

    const { fullName, email, password } = req.body;
    
    try {
        // See if user exists 
        let user = await User.findOne({ email: email });

        if(user){
            return res.status(400).send({error: 'User already exists'});
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
                    <p> Thanks for joining ASK-a-Peer! We're glad to have you as a member of our peer tutoring platform!  
                    </p> 

                    <p>
                    Please confirm your email address by clicking the link below: 
                    </p>

                    <a href="http://localhost:5000/auth/confirmation/${token}"> Verify Account </a>

                    <p> <b> Important: This link will expire within 24 hours. </b> </p>
                    <br />
                    <p><i> ASK-a-Peer is made possible by a grant from the Abbot Academy Fund, continuing Abbot's tradition of
                    boldness, innovation, and caring. </i></p>
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
        res.json({msg: 'Confirmation email sent'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({error: 'Server error'});
    }
});

// @route   GET /auth/confirmation/:token
// @desc    Page for when user clicks on email confirmation link
// @access  Private

router.get('/confirmation/:token', async (req, res) => {
    try {  
        const { user: { id }} = jwt.verify(req.params.token, config.get('jwtSecret')); 
        await User.findOneAndUpdate(
            { _id: id}, 
            { $set: {emailVerified: true }}
        ); 
        return res.send('Email confirmation page');
    } catch (err) {
        console.error(err.message);
        res.status(500).send({error: 'Server error'});
    }
    return res.redirect('/auth/login');
}); 

// @route   POST /auth/resend
// @desc    Resend an account confirmation email to a user
// @access  Public

router.post('/resend', [
    check('email', 'Please enter a valid email')
    .isEmail()
], async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).send({ error: error.errors[0].msg }); 
    }
    const { email } = req.body; 
    try {
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).send({ error: 'User not found'}); 
        }

        if(user.emailVerified){
            res.send('User email address has already been confirmed'); 
            return res.redirect('/auth/login'); 
        }

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
        res.json({msg: 'Confirmation email sent'});
    } catch (err){
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
}); 

// @route   POST /auth/forgotpassword
// @desc    Forgot password
// @access  Private

router.post('/forgotpassword', [
    check('email', 'Please enter a valid email')
    .isEmail()
], async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).send({ error: error.errors[0].msg }); 
    }
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }); 
        if(!user){
            return res.status(400).send({ error: 'User not found'}); 
        }
        // Send an email to a user with a jwt reset password link 
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
                    <p>
                    Hello! You are receiving this email because we received a password reset request from your account. 
                    </p>

                    <p> Click the link below to reset your password: </p>
                    <a href="http://localhost:5000/auth/resetpassword/${token}"> Reset Password </a>

                    <p> If you did not request a password reset, no further action is required. </p>
                    <p> <b> Important: This <u>one-time</u> link will expire within 24 hours. </b> </p>
                    
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
                subject: "ASK-a-Peer: Reset Password", 
                html: emailBody,
                });
            }
        );
        res.json({msg: 'Reset password email sent'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({error: 'Server error'});
    }
}); 

// @route   GET /auth/resetpassword/:token
// @desc    Redirect route to change user password
// @access  Private

router.get('/resetpassword/:token', (req, res) => {
    try {  
        return res.send('Reset Password Page');
    } catch (err){
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
}); 

// @route   POST /auth/resetpassword/:token
// @desc    Change user password
// @access  Private

router.post('/resetpassword/:token', [
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6})
], async (req, res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).send({ error: error.errors[0].msg}); 
    }
    const { password } = req.body;
    try {
        const token = await UsedToken.findOne({ token: req.params.token }); 
        if(token){
            return res.status(400).send({ error: 'This link has expired'}); 
        }
        
        try {
            const salt = await bcrypt.genSalt(10);
            const encryptedPass = await bcrypt.hash(password, salt);
            const { user: { id }} = jwt.verify(req.params.token, config.get('jwtSecret')); 
            await User.findOneAndUpdate(
                { _id: id}, 
                { $set: { password: encryptedPass }}, 
                { new: true}
            );
            const usedToken = new UsedToken({token: req.params.token});
            await usedToken.save()
        } catch(err) {
            if(err.message == 'jwt expired'){
                return res.status(400).send({ error: 'This link has expired'}); 
            }
            console.error(err.message);
            return res.status(400).send({ error: 'Unable to reset password'}); 
        }
        res.status(200).json({msg: 'Password changed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
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
            return res.status(400).json({ error: 'Invalid credentials'});
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
        res.status(500).send({error: 'Server error'});
    }
});

module.exports = router;