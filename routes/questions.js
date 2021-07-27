const express = require('express');
const router = express.Router();

const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

// @route   GET /questions
// @desc    Get all questions
// @access  Public

router.get('/', [], async (req, res) => {
    try{
        const questions = await Question.find().sort({ date: -1});
        res.json(questions);

    } catch (err) {
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

module.exports = router;