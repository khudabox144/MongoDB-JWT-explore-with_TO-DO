require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


const connectDB=require('./dbConfig/db')

const taskRoutes = require('./routes/taskRoutes');
const userRoutes=require('./routes/userRoutes');


const app= express();
dotenv.config();
const PORT=process.env.PORT || 3000;

// database connection 
connectDB()
.then(()=>{
    console.log('connection successfull');
})
.catch(err=>{
    throw new Error("database connection broke");
})

// set the Pug as the view engine 
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

//Middleware set 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/',taskRoutes);
app.use('/user',userRoutes);     

// convenience redirect so /signup works as well
app.get('/signup', (req, res) => res.redirect('/user/signup'));

app.listen(PORT,()=>{
    console.log(`Server is running at //localhost:${PORT}`);
})

