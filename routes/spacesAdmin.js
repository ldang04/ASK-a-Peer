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
        let space = await Space.findOne({ title: req.body.title }); 
        const user = await User.findOne({ _id: req.user.id });

        // Check if user had admin access 
        if(!user.admin){
            return res.status(400).send({error: 'Admin access required to create a space.'});
        }
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

        // Check if user has admin access
        if (!user.admin){
            return res.status(400).send({error: 'Admin access required to edit space'});
        }
        let space = await Space.findOne({ _id: req.params.space_id }); 
        
        if(!space){
            return res.status(400).send({error: 'Space not found'});
        }
        const newTitle = {title: req.body.title}; 

        space = await Space.findOneAndUpdate(
            { _id: req.params.space_id }, 
            { $set: newTitle }, 
            { new: true }
        ); 

        await space.save();
        return res.json(space);
    } catch (err) {
        // handle if space isn't found 
        if(err.kind == "ObjectId"){
            return res.status(404).send('Space does not exist'); 
        }
        console.error(err.message); 
        res.status(500).send('Server Error');
    }

});

// @todo: debug this function -.-'
// @route   DELETE /spaces/:space_id
// @desc    Delete a space
// @access  Private  (admin access)

router.delete('/:space_id', auth, async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 
       
        // Check if user has admin access 
        if(!user.admin){
            return res.status(400).send({error: 'Admin access required to delete space'});
        }

        const space = await Space.findOne({ _id: req.params.space_id});

        if (!space){
            return res.status(400).send({ error: 'Space not found' });
        }
        
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
    } catch (err) {
        // Handle if space not found 
        if(err.kind == "ObjectId"){
            res.status(400).send('Space not found');
        }
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

module.exports = router;
