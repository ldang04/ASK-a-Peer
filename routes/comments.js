const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Question = require('../models/Question');
const Comment = require('../models/Comment');
const Answer = require('../models/Answer');
const User = require('../models/User');

//@todo
// @route   POST /comments/:comment_id/vote
// @desc    Upvote/downvote a comment 
// @access  Private (user must be logged in)

module.exports = router;