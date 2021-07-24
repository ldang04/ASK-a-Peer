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
        const userLink = `/users/${req.user.id}`; 

        const spaceFields = {}; 
        spaceFields.moderators = []; 
        spaceFields.modNames = [];
        spaceFields.modAvatars = [];
        spaceFields.modLinks = []; 
        spaceFields.members = []; 

        spaceFields.title = req.body.title; 
        spaceFields.creator = req.user.id; 
        spaceFields.moderators.push(req.user.id);
        spaceFields.modNames.push(user.username); 
        spaceFields.modAvatars.push(user.avatar);
        spaceFields.modLinks.push(userLink);
        spaceFields.members.push(req.user.id);
        
        space = new Space(spaceFields);
        await space.save();

        res.json(space);

        // Add space to user
        

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
        return res.status(400).json({ errors: [{ msg: 'Invalid edit'}]});
    }

    try {
        let space = await Space.findOne({ _id: req.params.space_id }); 
        
        // @todo Check if user has access to space
    
        // Check if space exists 
        if(!space){ 
            return res.status(404).send('Space does not exist'); 
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
        console.error(err.message); 
        res.status(500).send('Server Error');
    }

});
// @route   POST /spaces/:space_id
// @desc    Edit space answers/questions
// @access  Private // !!!REMEMBER: change to admin access later on. 

// @route   POST /spaces/:space_id
// @desc    Edit space moderators
// @access  Private // !!!REMEMBER: change to admin access later on. 


module.exports = router;