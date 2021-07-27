const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @todo
// @route   POST /spaces/:space_id/moderators
// @desc    Add moderators to a space 
// @access  Private (admin/moderator access)

// @todo
// @route   DELETE /spaces/:space_id/moderators
// @desc    Delete moderators from a space 
// @access  Private (admin/moderator access)

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id
// @desc    delete space questions
// @access  Private (admin/moderator access)

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id/answers/:answer_id
// @desc    delete space answers
// @access  Private (admin/moderator access)

module.exports = router;
