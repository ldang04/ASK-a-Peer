const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');

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
            return res.status(403).send('Admin access required to create a space.');
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

    try {
        let space = await Space.findOne({ _id: req.params.space_id }); 

        // Check if user has admin access
        if (!space.admins.includes(req.user.id)){
            return res.status(403).send('Admin access required to edit space');
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

// @route   DELETE /spaces/:space_id
// @desc    Delete a space
// @access  Private  (admin access)

router.delete('/:space_id', auth, async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 

        // Check if user has admin access 
        if(!user.admin){
            return res.status(403).send({error: 'Admin access required to delete space'});
        }
        await Space.findOneAndRemove({ _id: req.params.space_id });

        // Delete space from user
        const spaceIndex = user.spaces.indexOf(req.params.space_id); 
        user.spaces.splice(spaceIndex, 1);

        // @todo Delete questions that belong to the space
        // @todo Delete (question) comments that belong to the space 
        // @todo Delete answers that belong to the space 
        // @todo Delete (answer) comments that belong to the space 
    
        // Save changes 
        await user.save();

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
