const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route   POST /report
// @desc    Report a problem 
// @access  Public

router.post('/report', [
    check('subject', ' Please enter a subject for your report')
    .not()
    .isEmpty(),
    check('email', 'Please enter a valid email')
    .isEmail(), 
    check('problem', 'Please describe your problem')
    .not()
    .isEmpty()
], async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).send({ error: error.errors[0].msg }); 
    }
    const { subject, email, problem } = req.body;
    try {
        const sendEmail = async () => {
            const emailBody = `
                    <p>The following error has been reported by an ASK-a-Peer user (${email}):</p>
                    <h3 style="color: red;">${problem}</h3>
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
        console.error(err.message);
        res.status(500).send({error: 'Server error'});
    }
}); 

module.exports = router;