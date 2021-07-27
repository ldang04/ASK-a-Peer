const express = require('express');
const router = express.Router();

const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Space = require('../models/Space');
const { json } = require('express');

// @route   GET /answers
// @desc    Get all answers
// @access  Public

router.get('/', async (req, res) => {
    try {
        const answers = await Answer.find(); 
        res.json(answers);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;