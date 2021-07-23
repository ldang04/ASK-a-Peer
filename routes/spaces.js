const express = require('express');
const router = express.Router();

// @route   GET /spaces
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Spaces route'));

module.exports = router;