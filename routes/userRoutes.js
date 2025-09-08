
const express = require('express');
const router=express.Router();
const userControllers=require('../controllers/UserController');


router.post('/signup',userControllers.signUp);
// Render signup page
router.get('/signup', (req, res) => {
	res.render('signup');
});

router.post('/login', userControllers.login);
router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});


module.exports = router;