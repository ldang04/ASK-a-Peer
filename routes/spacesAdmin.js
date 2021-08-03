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
    const errors = validationResult(req); 
    
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()}); 
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
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ _id: req.user.id });
        let space = await Space.findOne({ _id: req.params.space_id }); 
        
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
            return res.status(404).send('Space does not exist'); 
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

            // Delete comments from answers 
            if(space.answers.length > 0){
                space.answers.forEach(async (id) => {
                    let answer = await Answer.findOne({_id: id});
                
                    answer.comments.forEach(async (comment) => {
                        await Comment.findOneAndRemove({ _id: comment});
                    });
                });
            }
            
            // Delete space answers
            if(space.answers.length > 0){
                space.answers.forEach(async (answer) => {
                    await Answer.findOneAndRemove({ _id: answer});
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

// @todo
// @route   POST /spaces/:space_id/admins
// @desc    Add admins to a space
// @access  Private  (admin access)

// @todo
// @route   POST /spaces/:space_id/admins/delete
// @desc    Delete an admin from a space 
// @access  Private  (admin access)

// @route   POST /spaces/:space_id/moderators
// @desc    Add moderators to a space 
// @access  Private (admin access)

router.post('/:space_id/moderators', [auth, [
    check('email', 'Enter a valid email to add a moderator')
    .isEmail()
]], async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }

    const { email } = req.body
    try {
        const user = await User.findOne({_id: req.user.id});
        const space = await Space.findOne({ _id: req.params.space_id });
       
        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }

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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({ errors: errors.array()});
    }

    const { email } = req.body; 
    try {
        const user = await User.findOne({_id: req.user.id });
        const space = await Space.findOne({ _id: req.params.space_id});

        if(user.admin || space.admins.includes(req.user.id)){
            const moderator = await User.findOne({ email }); 

            if(!moderator){
                return res.status(400).send({ error: 'User not found'}); 
            }
            
            if(!space.moderators.includes(moderator._id)){
                return res.status(400).send({ error: 'User is not a moderator of this space'})
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

module.exports = router;
