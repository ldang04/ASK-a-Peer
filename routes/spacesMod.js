const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @todo
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

// @todo
// @route   POST /spaces/:space_id/moderators/delete
// @desc    Delete moderators from a space 
// @access  Private (admin access)

router.post('/spaces/:space_id/moderators/delete', [auth, [
    check('email', 'Enter a valid email to delete a moderator')
    .isEmail()
]], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).send({ errors: errors.array()});
    }

    const { email } = req.body; 
    try {
        const user = User.findOne({_id: req.user.id });
        const space = Space.findOne({ _id: req.params.space_id});

        if(user.admin || space.admins.includes(req.user.id)){
            const moderator = User.findOne({ email }); 
            if(!moderator){
                return res.status(400).send({ error: 'User not found'}); 
            }
            
            if(!space.moderators.includes(moderator._id)){
                return res.status(400).send({ error: 'User is not a moderator of this space'})
            }

            const modIndex = space.moderators.indexOf(moderator._id);
            space.moderators.splice(modIndex, 1);

            await space.save(); 
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
// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id
// @desc    delete space questions
// @access  Private (admin/moderator access)

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id/answers/:answer_id
// @desc    delete space answers
// @access  Private (admin/moderator access)

module.exports = router;
