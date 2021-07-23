const express = require('express');
const router = express.Router();

const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Space = require('../models/Space');

// @route   GET /answers
// @desc    Get all answers
// @access  Public

router.get('/', (req, res) => {
    res.send('Answers route');
});

module.exports = router;