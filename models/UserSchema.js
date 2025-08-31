const mongoose = require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
    active:{type:String,enum:['active','inactive']},
})

module.exports=mongoose.model('User',UserSchema);

