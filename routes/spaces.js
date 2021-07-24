const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @route   GET /spaces
// @desc    Get all spaces
// @access  Public
router.get('/', async (req, res) => {
    try {
        const spaces = await Space.find(); 
        res.json(spaces);
    } catch (err){
        console.error(err.message);
        res.json(500).send('Server error');
    }
});

// @route   POST /spaces
// @desc    Create a space
// @access  Private // !!!REMEMBER: change to admin access later on.

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

        // Check if space already exists
        if(space){
            return res.status(400).json({ errors: [{ msg: 'Space already exists' }]});
        }
        // Create space 
        const user = await User.findById(req.user.id);
    
        const spaceFields = {}; 

        spaceFields.admins = [];
        spaceFields.members = []; 

        spaceFields.title = req.body.title; 
        spaceFields.admins.push(req.user.id); 
        spaceFields.members.push(req.user.id);
        
        space = new Space(spaceFields);
        await space.save();

        res.json(space);

        // @todo: add space to user
        space = await Space.findOne({ title: req.body.title }); 
        user.spaces.push(space._id); 
        user.save();

    } catch (err) {
        console.error(err.message);
        res.json(500).send('Server error');
    }
});

// @route   POST /spaces/:space_id
// @desc    Edit a space (only title for now)
// @access  Private // !!!REMEMBER: change to admin access later on. 

router.post('/:space_id', [auth, [
    check('title', 'Title is required').isString()
]], async (req,res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let space = await Space.findOne({ _id: req.params.space_id }); 
        
        // @todo Check if user has access to space

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

// @route   DELETE /spaces/:space_id
// @desc    Delete a space
// @access  Private // !!!REMEMBER: change to admin access later on. 

router.delete('/:space_id', auth, async (req,res) => {
    try {
        await Space.findOneAndRemove({ _id: req.params.space_id });
        const user = await User.findOne({ _id: req.user.id }); 

        // Delete space from user
        const spaceIndex = user.spaces.indexOf(req.params.space_id); 
        user.spaces.splice(spaceIndex, 1);

        // Save changes 
        await user.save();

        res.json('Space deleted');
    } catch (err) {
        console.error(err.message);
        res.json(500).send('Server Error');
    }
});

// @route   POST /spaces/:space_id
// @desc    Edit space answers/questions
// @access  Private // !!!REMEMBER: change to admin access later on. 

// @route   POST /spaces/:space_id
// @desc    Edit space moderators
// @access  Private // !!!REMEMBER: change to admin access later on. 

// @route   POST /spaces/:space_id/questions
// @desc    Post a question to a space 
// @access  Private (user must be logged in)

// objectives: post to space, update space, add question to user 

router.post('/:space_id/questions', [auth, [
    check('title', 'Title is required').isString(), 
    check('description', 'Description is required').isString()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body; 

    try {
        console.log('req.user._id: ');
        console.log(req.user.id);
        // Create a question
        const space = await Space.findOne({ _id: req.params.space_id });
        const user = await User.findOne({ _id: req.user.id }); 

        const questionFields = {}; 
        questionFields.title = title; 
        questionFields.description = description; 
        questionFields.creator = req.user.id; 

        // let question = new Question(questionFields);
        // await question.save();
        
        console.log('Before spaces stuff');
        console.log('user id: ');
        console.log(user);
        // Add user and quesiton to space 
        if(!space.members.includes(user._id)){
            space.members.push(user._id);
        }
        console.log('After spaces stuff');


        // space.questions.push(question); 
        // await space.save();

        console.log('Before user stuff');
        // Add question and space to user
        if(!user.spaces.includes(space._id)){
            user.spaces.push(space._id);
        }

        console.log('After user stuff');

        // user.questions.push(question);
        // await user.save();

        res.json('Question posted');
    } catch(err) {
        // Handle if space isn't found
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'Space not found '});
        console.error(err.message);
        res.json(500).send('Server Error');
    }
}); 

// @route   POST /spaces/:space_id/answers
// @desc    Post an answer to a space 
// @access  Private (user must be logged in)

// @route   POST /spaces/:space_id/join
// @desc    Join a space 
// @access  Private (user must be logged in)

// @route   POST /spaces/:space_id/leave
// @desc    Leave a space 
// @access  Private (user must be logged in)

module.exports = router;