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
            return res.status(400).send({error: 'Admin access is required to create a space.'});
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

        res.json(space);
    } catch (err) {
        console.error(err.message);
        res.json(500).send('Server error');
    }
});

// @route   POST /spaces/:space_id
// @desc    Edit the title of a space
// @access  Private (admin access)

router.post('/:space_id', [auth, [
    check('title', 'Title is required').isString()
]], async (req,res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.errors[0].msg});
    }

    try {
        const user = await User.findOne({ _id: req.user.id });
        let space = await Space.findOne({ _id: req.params.space_id }); 
        
        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

        // Check if user has admin access
        if (user.admin || space.admins.includes(user._id)){
            const newTitle = {title: req.body.title}; 

            space = await Space.findOneAndUpdate(
                { _id: req.params.space_id }, 
                { $set: newTitle }, 
                { new: true }
            ); 
    
            await space.save();
            res.json(space);
        } else {
            return res.status(400).send({error: 'Admin access required to edit space'});
        }

    } catch (err) {
        // handle if space isn't found 
        if(err.kind == "ObjectId"){
            return res.status(404).send('Space not found'); 
        }
        console.error(err.message); 
        res.status(500).send('Server Error');
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
            return res.status(400).send({ error: 'Space not found'});
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
            res.json('Space deleted');
        } else {
            return res.status(400).send({error: 'Admin access required to delete space'});
        }

    } catch (err) {
        // Handle if space not found 
        if(err.kind == "ObjectId"){
            res.status(400).send('Space not found');
        }
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

// @route   POST /spaces/:space_id/admins
// @desc    Add admins to a space
// @access  Private  (admin access)

router.post('/:space_id/admins', [auth, [
    check('email', 'Enter a valid email to add an admin')
    .isEmail()
]], async (req, res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.errors[0].msg});
    }
    const { email } = req.body; 
    try{
        const user = await User.findOne({ _id: req.user.id });
        const space = await Space.findOne({ _id: req.params.space_id });

        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

        // Check if user has admin access 
        if(user.admin || space.admins.includes(user._id)){
            const newAdmin = await User.findOne({ email });
            
            if(!newAdmin){
                return res.status(400).send({ error: 'User not found'})
            }

            if(!space.admins.includes(newAdmin._id)){
                space.admins.push(newAdmin._id); 
            } else {
                res.status(400).send({ error: 'User is already an admin of this space'});
            }

            if(!space.members.includes(newAdmin._id)){
                space.members.push(newAdmin._id);
            }

            await space.save();
            res.json(space);
        } else {
            res.status(400).send({ error: 'Admin access is required to add a moderator to this space'});
        }
    } catch (err){
        // Handle if space not found 
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Space not found'});
        }
        res.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /spaces/:space_id/admins/delete
// @desc    Delete an admin from a space 
// @access  Private  (admin access)

router.post('/:space_id/admins/delete', [auth, [
    check('email', 'Enter a valid email to delete an admin')
    .isEmail()
]], async (req,res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.errors[0].msg});
    }

    const { email } = req.body; 
    try {
        const user = await User.findOne({ _id: req.user.id });
        const space = await Space.findOne({ _id: req.params.space_id }); 

        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

        if(user.admin || space.admins.includes(user._id)){
            const spaceAdmin = await User.findOne({ email }); 

            if(!spaceAdmin){
                return res.status(400).send({ error: 'User not found'});
            }

            if(!space.admins.includes(spaceAdmin._id)){
                return res.status(400).send({ error: 'User is not an admin of this space'});
            }

            const adminIndex = space.admins.indexOf(spaceAdmin._id); 
            space.admins.splice(adminIndex, 1);

            await space.save();
            res.json(space);
        } else {
            res.status(400).send({ error: 'Admin access is required to delete an admin'});
        }

    } catch (err) {
        // Handle if space isn't found 
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Space not found'}); 
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route   POST /spaces/:space_id/moderators
// @desc    Add moderators to a space 
// @access  Private (admin access)

router.post('/:space_id/moderators', [auth, [
    check('email', 'Enter a valid email to add a moderator')
    .isEmail()
]], async (req, res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.errors[0].msg});
    }

    const { email } = req.body
    try {
        const user = await User.findOne({_id: req.user.id});
        const space = await Space.findOne({ _id: req.params.space_id });

        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

        // Check if user has admin access 
        if(user.admin || space.admins.includes(user._id)){
            const newMod  = await User.findOne({ email }); 

            if(!newMod){
                return res.status(400).send({ error: 'User not found'});
            }
            
            if(!space.moderators.includes(newMod._id)){
                space.moderators.push(newMod._id);
            } else {
                return res.status(400).send({ error: 'User is already a moderator of this space'});
            }

            if(!space.members.includes(newMod._id)){
                space.members.push(newMod._id);
            }

            await space.save();
            res.json(space);
        } else {
            res.status(400).send({ error: 'Admin access is required to add a moderator to this space'});
        }
        
    } catch (err){
        if(err.kind == 'ObjectId'){ // Handle if space isn't found
            return res.status(400).send({ error: 'Space not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /spaces/:space_id/moderators/delete
// @desc    Delete a moderator from a space 
// @access  Private (admin access)

router.post('/:space_id/moderators/delete', [auth, [
    check('email', 'Enter a valid email to delete a moderator')
    .isEmail()
]], async (req,res) => {
    const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.errors[0].msg});
    }

    const { email } = req.body; 
    try {
        const user = await User.findOne({_id: req.user.id });
        const space = await Space.findOne({ _id: req.params.space_id});

        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

        if(user.admin || space.admins.includes(req.user.id)){
            const moderator = await User.findOne({ email }); 

            if(!moderator){
                return res.status(400).send({ error: 'User not found'}); 
            }
            
            if(!space.moderators.includes(moderator._id)){
                return res.status(400).send({ error: 'User is not a moderator of this space'});
            }

            const modIndex = space.moderators.indexOf(moderator._id);
            space.moderators.splice(modIndex, 1);

            await space.save(); 
            res.json(space);
        } else {
            res.status(400).send({ error: 'Admin access is required to delete a moderator'});
        }
    } catch (err){
        if( err.kind == "ObjectId"){
            return res.status(400).send({ error: 'Space not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
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
            return res.status(400).send({ error: 'Space not found'})
        }

        if(!question) {
            return res.status(400).send({ error : 'Question not found'});
        }
        
        if(!comment){
            return res.status(400).send({ error: 'Comment not found'});
        }

        if(!question.comments.includes(comment._id)){
            return res.status(400).send('This comment does not belong to the given question. Check browser URL.');
        }

        if(req.user.id == comment.creator || space.admins.includes(req.user.id) || space.moderators.includes(req.user.id) || user.admin){
            const commentIndex = question.comments.indexOf(req.params.comment_id);
            question.comments.splice(commentIndex, 1);
            
            await Comment.findOneAndRemove({ _id: req.params.comment_id });
            await question.save();
    
            res.json('Comment deleted');
        } else {
            res.status(400).send('Comment delete access unauthorized');
        }
        
    } catch (err) {
        if(err.kind == "ObjectId"){
            return res.status(400).send({ error: "Comment not found"});
        }

        console.error(err.message);
        res.status(500).send('Server Error');
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
            return res.status(400).send({ error: 'Space not found'});
        }
        
        if(user.admin || space.admins.includes(user._id) || space.moderators.includes(user._id) || user._id == comment.creator){
            try {
                const answer = await Answer.findOne({ _id: req.params.answer_id }); 
                let comment = await Comment.findOne({ _id: req.params.comment_id });

                const commentIdx = answer.comments.indexOf(comment._id); 
                answer.comments.splice(commentIdx, 1); 

                await Comment.findOneAndRemove({ _id: req.params.comment_id}); 
                await answer.save();

                res.json(answer);
            } catch (err){
                res.status(400).send({ error: 'Answer and/or comment not found.'}); 
            }
        } else {
            res.status(400).send({ error: 'Comment delete access unauthorized'}); 
        }

    } catch (err){
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ error: 'Space not found'}); 
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); 

module.exports = router;
