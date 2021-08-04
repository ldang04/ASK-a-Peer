const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @todo
// @route   POST /spaces/:space_id/questions/:question_id/answers
// @desc    Post an answer to a question
// @access  Private (admin/moderator access)

router.post('/:space_id/questions/:question_id/answers', [auth, [
    check('description', 'Answer text is required')
    .not()
    .isEmpty()
]], async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty){
        return res.status(400).json({ errors: errors.array()});
    }
    const { description } = req.body; 
    try {
        const user = await User.findOne({ _id: req.user.id });
        const space = await Space.findOne({ _id: req.params.space_id}); 
        const question = await Question.findOne({ _id: req.params.question_id}); 

        if(user.admin || space.admins.includes(user._id) || space.moderators.includes(user._id)){
            const answerFields = {}; 
            answerFields.questionName = question.title; 
            answerFields.description = description; 
            answerFields.creator = user._id; 

            let answer = new Answer(answerFields);
            question.answers.push(answer);

            // Save changes 
            await answer.save();
            await question.save();

            res.json(question);
        } else {
            res.status(400).send({ error: 'Admin or moderator access is required to post a question'}); 
        }
    } catch (err){
        if (err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Space and/or question locations not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id/answers/:answer_id
// @desc    Delete an answer from a question in a space
// @access  Private (admin/moderator access)

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id
// @desc    delete a question from a space
// @access  Private (admin/moderator access)


module.exports = router;
