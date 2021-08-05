const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');

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

        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

        if(!question){
            return res.status(400).send({ error: 'Question not found'}); 
        }

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
            return res.status(400).send({ error: 'Space and/or question not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /spaces/:space_id/questions/:question_id/answers/:answer_id
// @desc    Delete an answer from a question in a space
// @access  Private (admin/moderator/creator access)

router.delete('/:space_id/questions/:question_id/answers/:answer_id', auth, async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 
        const space = await Space.findOne({ _id: req.params.space_id }); 
        const question = await Question.findOne({ _id: req.params.question_id }); 
        const answer = await Answer.findOne({ _id: req.params.answer_id }); 

        if(!space){
            return res.status(400).send({ error: 'Space not found' }); 
        }

        if(!question){
            return res.status(400).send({ error: 'Question not found' }); 
        }

        if(!answer){
            return res.status(400).send({ error: 'Answer not found'}); 
        }

        if(user.admin || space.admins.includes(user._id) || space.moderators.includes(users._id) || user._id == answer.creator){
            if(!question.answers.includes(answer._id)){
                return res.status(400).send({ error: 'Answer does not belong to this question'}); 
            }

            // Delete comments that belong to answer 
            if(answer.comments.length > 0){
                answer.comments.forEach(async (comment) => {
                    await Comment.findOneAndRemove({ _id: comment}); 
                }); 
            }

            // Delete answer from question 
            const answerIdx = question.answers.indexOf(answer._id);
            question.answers.splice(answerIdx, 1); 

            // Delete answer
            await Answer.findOneAndRemove({ _id: answer._id }); 
            await question.save();
            res.json(question);
        } else {
            res.status(400).send({ error: 'Answer delete access unauthorized'}); 
        }
    } catch (err){
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Space, question, and/or answer not found'}); 
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /spaces/:space_id/questions/:question_id
// @desc    delete a question from a space
// @access  Private (admin/moderator access)

router.delete('/:space_id/questions/:question_id', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 
        const space = await Space.findOne({ _id: req.params.space_id }); 
        const question = await Question.findOne({ _id: req.params.question_id }); 

        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

        if(!question){
            return res.status(400).send({ error: 'Question not found'});
        }

        if(user.admin || space.admins.includes(user._id) || space.moderators.includes(user._id)){
            if(!space.questions.includes(question._id)){
                return res.status(400).send({ error: 'Question does not belong to this space'}); 
            }

            // Delete comments that belong to question
            if(question.comments.length > 0){
                question.comments.forEach(async (comment) => {
                    await Comment.findOneAndRemove({ _id: comment}); 
                }); 
            }

            // Delete answer comments that belong to question 
            if(question.answers.length > 0){
                question.answers.forEach(async (answerId) => {
                    let answer = await Answer.findOne({ _id: answerId }); 
                    if(answer.comments.length > 0){
                        answer.comments.forEach(async (comment) => {
                            await Comment.findOneAndRemove({ _id: comment})
                        }); 
                    }
                    await Answer.findOneAndRemove({ _id: answer }); 
                }); 
            }
            // Delete answers that belong to question
            const questionIdx = space.questions.indexOf(question._id); 
            space.questions.splice(questionIdx, 1); 
            
            await Question.findOneAndRemove({ _id: question._id });
            await space.save();
            res.json(space);
        } else {
            res.status(400).send({ error: 'Question delete access unauthorized'}); 
        }
    } catch (err){
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Space and/or question not found' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
