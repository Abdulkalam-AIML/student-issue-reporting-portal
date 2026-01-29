const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/admin-data', require('../controllers/authController').getAdminData);

module.exports = router;
