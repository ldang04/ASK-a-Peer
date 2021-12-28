const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route   POST /report
// @desc    Report a problem 
// @access  Public

router.post('/report', [
    check('subject', ' Please enter a brief title describing the nature of your problem')
    .not()
    .isEmpty(),
    check('email', 'Authorization error. You may not be logged in or properly authorized. Refresh the page or try again later')
    .not()
    .isEmpty(),
    check('problem', 'Please describe your problem as specifically as possible')
    .not()
    .isEmpty(),
    check('instructions', 'Please describe what steps we can take to reproduce the problem that you experienced')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() }); 
    }
    const { subject, problem, email, instructions } = req.body;
    try {
        const sendEmail = async () => {
            const emailBody = `
                    <h3>The following error has been reported by an ASK-a-Peer user (${email}):</h3>
                    <h4 style="color: red;">Error description: </h4>
                    <p style="color: red;">${problem}</p>
                    <h4 style="color: red;">Steps to reproduce error: </h4>
                    <p style="color: red;">${instructions}</p>
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
                to: "ddang23@andover.edu", 
                subject: `ASK-a-Peer Report: ${subject}`, 
                html: emailBody,
                });
        }
        sendEmail();
        res.json({ msg: 'Report submitted! Thanks to user feedback, we are able to continually improve ASK-a-Peer, and make it the best platform it can be'});
    } catch (err) {
        console.log(err);
        res.status(500).send({error: 'Server error'});
    }
}); 

module.exports = router;