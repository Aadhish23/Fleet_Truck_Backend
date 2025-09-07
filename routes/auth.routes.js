const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const authController = require('../controllers/auth.controller');

router.post('/login', login);
router.get('/me', protect, getProfile); 
router.post('/register', authController.register);

module.exports = router;