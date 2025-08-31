const mongoose = require('mongoose');
const User = require('../models/UserSchema');
const jwt=require('jsonwebtoken');
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    console.log('Incoming signup request body:', req.body);
    console.log('Mongoose connection state:', mongoose.connection.readyState);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      active: req.body.active,
    };

  const newUser = new User(user);
  const saved = await newUser.save();
  console.log('User saved, id:', saved._id);
    res.status(200).json({
      message: "User created Successfully",
      id: saved._id,
    });
  } catch (err) {
    console.error('Error in signUp:', err);
    res.status(500).json({
      message: "Something went wrong while creating new User",
    });
  }
};

exports.login=async(req,res)=>{
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // find user in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // generate token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'changeme', {
      expiresIn: '1h',
    });

    // set token as HttpOnly cookie and redirect to home page
    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1 hour
    return res.redirect('/');
    
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Authentication failed' });
  }
}