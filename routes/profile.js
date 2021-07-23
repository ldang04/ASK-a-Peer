const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../models/Profile');

// @route   GET /profiles/me
// @desc    Get current users' profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // @todo: populate profile with spaces and posts. 
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['username, avatar, email']); 

        // if no profile for user
        if (!profile){
            return res.status(400).json({ msg: 'This user does not have a profile'});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /profiles
// @desc    Update a user profile (a user should have one by default)
// @access  Private

router.post('/', auth , async (req, res) => {
    const {
        bio, 
        backgroundPicture
    } = req.body; 

    // Build profile object 
    const profileFields = {}; 
    profileFields.user = req.user.id; 
    
    if(bio) profileFields.bio = bio; 
    if(backgroundPicture) profileFields.backgroundPicture = backgroundPicture; 

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        //Update the profile
         profile = await Profile.findOneAndUpdate(
            { user: req.user.id }, 
            { $set: profileFields }, 
            { new: true }
         );
            
         return res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
});

// @route   POST /profiles/:user_id
// @desc    Get another user's profile by user id
// @access  Public

router.get('/:user_id', async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id });

        if(!profile){
            res.status(404).send('Profile not found');
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;