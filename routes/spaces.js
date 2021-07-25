//=======================================================================================
// @TODO Refactor spaces into access level files: admin, admin/moderator, regular user
//=======================================================================================
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
            return res.status(403).send('Admin access denied.');
        }
        // Check if space already exists
        if(space){
            return res.status(400).json({ errors: [{ msg: 'Space already exists' }]});
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

        space = await Space.findOne({ title: req.body.title }); 
        user.spaces.push(space._id); 
        user.save();

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
    console.log(req.user.id);

    try {
        let space = await Space.findOne({ _id: req.params.space_id }); 

        // Check if user has admin access
        if (!space.admins.includes(req.user.id)){
            return res.status(403).send('Edit access forbidden');
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

// @todo
// @route   POST /spaces/:space_id/moderators
// @desc    Add moderators to a space using their email
// @access  Private (admin/moderator access)

// @todo
// @route   DELETE /spaces/:space_id/moderators
// @desc    Delete moderators from a space using their email
// @access  Private (admin/moderator access)


// @route   DELETE /spaces/:space_id
// @desc    Delete a space
// @access  Private  (admin access)

router.delete('/:space_id', auth, async (req,res) => {
    try {
        await Space.findOneAndRemove({ _id: req.params.space_id });
        const user = await User.findOne({ _id: req.user.id }); 

        // Check if user has admin access 
        if(!user.admin){
            return res.status(403).send('Delete access denied');
        }

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

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id
// @desc    delete space questions
// @access  Private (admin/moderator access)

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id/answers/:answer_id
// @desc    delete space answers
// @access  Private (admin/moderator access)


// @route   POST /spaces/:space_id/questions
// @desc    Post a question to a space 
// @access  Private (user must be logged in)

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
        // Create a question
        const space = await Space.findOne({ _id: req.params.space_id });
        const user = await User.findOne({ _id: req.user.id });

        const questionFields = {}; 
        questionFields.title = title; 
        questionFields.description = description; 
        questionFields.creator = req.user.id; 

        let question = new Question(questionFields);
        await question.save();
        
        // Add user and quesiton to space 
        if(!space.members.includes(user._id)){
            space.members.push(user._id);
        }

        space.questions.push(question); 
        await space.save();

        // Add question and space to user
        if(!user.spaces.includes(space._id)){
            user.spaces.push(space._id);
        }

        user.questions.push(question);
        await user.save();

        res.json('Question posted');
    } catch(err) {
        // Handle if space isn't found
        if (err.kind == 'ObjectId') return res.status(400).json({ msg: 'Space not found '});
        console.error(err.message);
        res.json(500).send('Server Error');
    }
}); 


// @route   POST /spaces/:space_id/questions/:question_id
// @desc    edit a question title and/or description
// @access  Private (user must be logged in)

router.post('/:space_id/questions/:question_id', auth, async (req,res) => {
    try {
        let question = await Question.findOne({ _id: req.params.question_id });
       
        // Check if user has access to edit question 
        if ( req.user.id != question.creator ){
            res.status(403).send('Edit access unauthorized');
        }

        // Update question
        const questionFields = {}; 
        if(req.body.title) questionFields.title = req.body.title; 
        if(req.body.description) questionFields.description = req.body.description; 
        
        question = await Question.findOneAndUpdate(
            { _id: req.params.question_id}, 
            { $set: questionFields }, 
            { new: true}
        ); 

        await question.save();
        res.json(question);

    } catch(err) {
        // handle if question or space were not found
        if(err.kind == 'ObjectId'){
            return res.status(400).send('Question not found');
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @todo
// @route   POST /spaces/:space_id/questions/:question_id/comments
// @desc    Post a comment to a question
// @access  Private (user must be logged in)

// @todo
// @route   POST /spaces/:space_id/questions/:question_id/answers
// @desc    Post an answer to a space 
// @access  Private (user must be logged in)

// @todo
// @route   POST /spaces/:space_id/questions/:question_id/answers/:answer_id/comments
// @desc    Post a comment to an answer
// @access  Private (user must be logged in)

// @todo
// @route   POST /spaces/:space_id/join
// @desc    Join a space 
// @access  Private (user must be logged in)

// @todo
// @route   POST /spaces/:space_id/leave
// @desc    Leave a space 
// @access  Private (user must be logged in)

module.exports = router;