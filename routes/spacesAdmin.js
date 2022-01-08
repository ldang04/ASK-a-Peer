const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');

// @route   POST /spaces
// @desc    Create a space
// @access  Private (admin access)

router.post('/', [auth, [
    check('title', 'Title is required')
    .isString()
]], async (req, res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.errors[0].msg});
    }

    try {
        const user = await User.findOne({ _id: req.user.id });

        // Check if user has admin access 
        if(!user.admin){
            return res.status(401).send({error: 'Admin access is required to create a space.'});
        }

        let space = await Space.findOne({ title: req.body.title }); 

        // Check if space already exists
        if(space){
            return res.status(400).json({ error: 'Space already exists' });
        }
        // Create space 
        const spaceFields = {}; 

        spaceFields.admins = [];
        spaceFields.members = []; 

        spaceFields.title = req.body.title; 
        spaceFields.admins.push(req.user.id); 
        spaceFields.members.push(req.user.id);
                
        space = new Space(spaceFields);
        await space.save();

        res.redirect('/spaces');
    } catch (err) {
        console.log('error caught');
        console.error(err.message);
        res.json(500).send({error: 'Server error'});
    }
});

// @route   POST /spaces/:space_id
// @desc    Edit a space
// @access  Private (admin access)

router.post('/:space_id', [auth, [
    check('title', 'Title is required')
    .not()
    .isEmpty(),
    check('admins', 'At least one admin is required in a space')
    .not()
    .isEmpty(),
    check('moderators', 'Invalid moderator input')
    .exists()
]], async (req,res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.errors[0].msg});
    }
    try {
        const user = await User.findOne({ _id: req.user.id });
        let space = await Space.findOne({ _id: req.params.space_id }); 
        
        if(!space){
            return res.status(404).send({ error: 'Space not found'});
        }

        // Check if user has admin access
        if (user.admin || space.admins.includes(user._id)){
            // const newTitle = {title: req.body.title}; 
            const admins = req.body.admins; 
            const moderators = req.body.moderators; 
            let foundAdmins; 

            try {
                foundAdmins = await User.find({
                    email: {
                        $in: admins
                    }
                });
            }catch(err){
                return res.status(401).send({ error: 'Could not find admin(s)'})
            }

            const foundAdminIds = foundAdmins.map(admin => admin._id);
            
            let foundModerators;
            try {
                foundModerators = await User.find({
                    email: {
                        $in: moderators
                    }
                });
            } catch (err) {
                return res.status(401).send({ error: 'Could not find moderator(s)'});
            }
            const foundModeratorIds = foundModerators.map(moderator => moderator._id);
            
            space.title = req.body.title;
            if(foundAdminIds.length > 0) space.admins = foundAdminIds;
            space.moderators = foundModeratorIds; 
            
            await space.save();
            await Space.findOne({ _id: space._id })
                .populate('admins', ['fullName', 'email', 'avatar', 'pronouns'])
                .populate('moderators', ['fullName', 'email', 'avatar', 'pronouns'])
                .exec()
                .then( space => {
                    if(!space){
                        return res.status(404).send({ error: 'Space not found'});
                    }
                    return res.json({title: space.title, moderators: space.moderators, admins: space.admins});
                });
        } else {
            return res.status(401).send({error: 'Admin access is required to edit a space'});
        }
    } catch (err) {
        // handle if space isn't found 
        if(err.kind == "ObjectId"){
            return res.status(404).send('Space not found'); 
        }
        console.error(err.message); 
        res.status(500).send({error: 'Server Error'});
    }

});

// @route   DELETE /spaces/:space_id
// @desc    Delete a space
// @access  Private  (admin access)

router.delete('/:space_id', auth, async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 
        const space = await Space.findOne({ _id: req.params.space_id});

        if(!space){
            return res.status(404).send({ error: 'Space not found'});
        }

        // Check if user has admin access 
        if(user.admin || space.admins.includes(user._id)){
            
            // Delete comments that belong to space questions
            if(space.questions.length > 0){
                space.questions.forEach(async (id) => {
                    let question = await Question.findOne({_id: id});
                
                    question.comments.forEach(async (comment) => {
                        await Comment.findOneAndRemove({ _id: comment});
                    });
                });
            }

            // Delete space questions 
            if(space.questions.length > 0){
                space.questions.forEach(async (question) => {
                    await Question.findOneAndRemove({ _id: question});
                });
            }

        // Delete space
            await Space.findOneAndRemove({ _id: req.params.space_id });
            res.json({msg: 'Space deleted'});
        } else {
            return res.status(401).send({error: 'Admin access is required to delete a space'});
        }

    } catch (err) {
        // Handle if space not found 
        if(err.kind == "ObjectId"){
            res.status(404).send({error: 'Space not found'});
        }
        console.error(err.message);
        res.json(500).send({error: 'Server Error'});
    }
});

// @route   DELETE /spaces/:space_id/questions/:question_id/comments/:comment_id
// @desc    Delete a comment in a question
// @access  Private (user must be logged in)

router.delete('/:space_id/questions/:question_id/comments/:comment_id', auth, async(req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        const space = await Space.findOne({ _id: req.params.space_id});
        const question = await Question.findOne({ _id: req.params.question_id });
        let comment = await Comment.findOne({ _id: req.params.comment_id });

        if(!space){
            return res.status(404).send({ error: 'Space not found'})
        }

        if(!question) {
            return res.status(404).send({ error : 'Question not found'});
        }
        
        if(!comment){
            return res.status(404).send({ error: 'Comment not found'});
        }

        if(!question.comments.includes(comment._id)){
            return res.status(400).send({error: 'This comment does not belong to the given question. Check browser URL.'});
        }

        if(req.user.id == comment.creator || space.admins.includes(req.user.id) || space.moderators.includes(req.user.id) || user.admin){
            const commentIndex = question.comments.indexOf(req.params.comment_id);
            question.comments.splice(commentIndex, 1);
            
            await Comment.findOneAndRemove({ _id: req.params.comment_id });
            await question.save();
    
            res.json({msg: 'Comment deleted'});
        } else {
            res.status(401).send({error: 'Comment delete access unauthorized'});
        }
        
    } catch (err) {
        if(err.kind == "ObjectId"){
            return res.status(404).send({ error: "Comment not found"});
        }

        console.error(err.message);
        res.status(500).send({error:'Server Error'});
    }
});

// @route   DELETE /spaces/:space_id/answers/:answer_id/comments/:comment_id
// @desc    Delete a comment in an answer
// @access  Private (admin/space admin/moderator/user)

router.delete('/:space_id/answers/:answer_id/comments/:comment_id', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id});
        const space = await Space.findOne({ _id: req.params.space_id }); 

        if(!space){
            return res.status(404).send({ error: 'Space not found'});
        }
        
        if(user.admin || space.admins.includes(user._id) || space.moderators.includes(user._id) || user._id == comment.creator){
            try {
                const answer = await Answer.findOne({ _id: req.params.answer_id }); 
                let comment = await Comment.findOne({ _id: req.params.comment_id });

                if(!answer){
                    return res.status(404).send({ error: 'Answer not found'}); 
                }

                if(!comment){
                    return res.status(404).send({ error: 'Comment not found'}); 
                }

                const commentIdx = answer.comments.indexOf(comment._id); 
                answer.comments.splice(commentIdx, 1); 

                await Comment.findOneAndRemove({ _id: req.params.comment_id}); 
                await answer.save();

                res.json({msg: 'Comment deleted'});
            } catch (err){
                res.status(404).send({ error: 'Answer and/or comment not found.'}); 
            }
        } else {
            res.status(401).send({ error: 'Comment delete access unauthorized'}); 
        }

    } catch (err){
        if(err.kind == 'ObjectId'){
            return res.status(404).send({ error: 'Space not found'}); 
        }
        console.error(err.message);
        res.status(500).send({error: 'Server Error'});
    }
}); 

module.exports = router;
