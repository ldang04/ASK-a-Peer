const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Space = require('../models/Space');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');

// @route   POST /spaces/:space_id/questions
// @desc    Post a question to a space 
// @access  Private (user must be logged in)

router.post('/:space_id/questions', [auth, [
    check('title', 'Title is required')
    .not()
    .isEmpty(), 
    check('description', 'Description is required')
    .not()
    .isEmpty()
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

        if(!space){
            return res.status(400).send({ error: 'Space not found'});
        }
        const questionFields = {}; 
        questionFields.title = title; 
        questionFields.description = description; 
        questionFields.creator = req.user.id; 

        let question = new Question(questionFields);
        await question.save();
        
        // Add user and question to space 
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
        if (err.kind == 'ObjectId') return res.status(400).send({ error: 'Space not found '});
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
            res.status(400).send({error: 'Edit access unauthorized'});
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
        // handle if question is not found
        if(err.kind == 'ObjectId'){
            return res.status(400).send({error: 'Question not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @todo
// @route   POST /spaces/:space_id/questions/:question_id/comments
// @desc    Post a comment to a question
// @access  Private (user must be logged in)

router.post('/:space_id/questions/:question_id/comments', [auth, [
    check('text', 'Comment text is required').not().isEmpty()
]], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    try {
        const question = await Question.findOne({ _id: req.params.question_id });

        const commentText = {
            text: req.body.text, 
            creator: req.user.id
        };

        let comment = new Comment(commentText);
        await comment.save();
        
        question.comments.push(comment);
        await question.save()

        res.json(question);
    } catch(err){
        if (err.kind == "ObjectId"){
            return res.status(400).send({error: 'Question not found'})
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id/comments/:comment_id
// @desc    Delete a comment in a question
// @access  Private (user must be logged in)

router.delete('/:space_id/questions/:question_id/comments/:comment_id', auth, async(req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        const space = await Space.findOne({ _id: req.params.space_id });
        const question = await Question.findOne({ _id: req.params.question_id });
        let comment = await Comment.findOne({ _id: req.params.comment_id });

        if(!space){
            return res.status(400).send('Space not found');
        }

        if(!question) {
            return res.status(400).send('Question not found');
        }
        
        if(!comment){
            return res.status(400).send('Comment not found');
        }
        
        if(!space.questions.includes(question._id)){
            return res.status(400).send('This question does not belong to the given space. Check browser URL.');
        }

        if(!question.comments.includes(comment._id)){
            return res.status(400).send('This comment does not belong to the given question. Check browser URL.');
        }

        if(req.user.id == comment.creator || space.moderators.includes(req.user.id) || user.admin){
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

// @todo
// @route   POST /spaces/:space_id/questions/:question_id/answers
// @desc    Post an answer to a space 
// @access  Private (user must be logged in)

// @todo
// @route   POST /spaces/:space_id/questions/:question_id/answers/:answer_id/comments
// @desc    Post a comment to an answer
// @access  Private (user must be logged in)

// @todo
// @route   DELETE /spaces/:space_id/questions/:question_id/answers/:answer_id/comments/:comment_id
// @desc    Delete a comment in an answer
// @access  Private (user must be logged in)

// @route   POST /spaces/:space_id/join
// @desc    Join a space as a member
// @access  Private (user must be logged in)

router.post('/:space_id/join', auth, async(req,res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        const space = await Space.findOne({ _id:req.params.space_id });
        
        // Check if user is already in space
        if(space.members.includes(req.user.id)){
            return res.status(400).send({error: 'User already belongs to space'});
        }

        space.members.push(req.user.id);
        user.spaces.push(req.params.space_id);

        await space.save();
        await user.save();

        res.json('Joined space');
    } catch (err){
        // Handle if space isn't found
        if(err.kind == "ObjectId"){
            return res.status(400).send({ error: 'Space not found '});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /spaces/:space_id/leave
// @desc    Leave a space 
// @access  Private (user must be logged in)

router.post('/:space_id/leave', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }); 
        const space = await Space.findOne({ _id: req.params.space_id});
        
        // Check if space is part of user spaces
        if(!user.spaces.includes(req.params.space_id)) return res.status(400).send('User not member of space');

        // Remove space from user 
        const spaceIndex = user.spaces.indexOf(req.params.space_id); 
        user.spaces.splice(spaceIndex, 1);

        // Remove user as member of space 
        if(!space.members.includes(req.user.id)) return res.status(400).send('User not member of space');
        
        const userIndex = space.members.indexOf(req.user.id);
        space.members.splice(userIndex, 1);

        //Remove user as a moderator of space
        if(space.moderators.includes(req.user.id)){
            if(space.moderators.length == 1){
                return res.status(400).send({error: 'Space must have at least one moderator; assign another before leaving'})
            }
            const modIdIndex = space.moderators.indexOf(req.user.id);
            const modNameIndex = space.modNames.indexOf(user.username);
            const modAvatarIndex = space.modAvatars.indexOf(user.avatar);
            const modLinkIndex = space.modLinks.indexOf(`/users/${req.user.id}`);

            space.moderators.splice(modIdIndex, 1);
            space.modnames.splice(modNameIndex, 1);
            space.modAvatars.splice(modAvatarIndex, 1);
            space.modLinks.splice(modLinkIndex, 1);
        }  

        // Remove user as an admin of space (if there are other admins)
        if(space.admins.includes(req.user.id)){
            if(space.admins.length == 1){
                return res.status(400).send({error: 'Space must have at least one administrator; assign another before leaving.'});
            }
            const adminIndex = space.admins.indexOf(req.user.id);
            space.admins.splice(adminIndex, 1);
        }

        // Save changes 

        await user.save(); 
        await space.save();

        res.json('Exited space');
    } catch (err){
        // Handle if space isn't found 
        if(err.kind == 'ObjectId'){
            return res.status(400).send('Space not found');
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;