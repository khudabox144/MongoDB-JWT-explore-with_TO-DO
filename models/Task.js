const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description can't exceed 500 characters"],
    default: "",
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

//Assinging a function to the "methods" object of our todoSchema
taskSchema.methods={
  completedMethod:function(){
    return mongoose.model('Task').find({completed:true});
  },
}

taskSchema.methods.completedMethodCb = function (cb) {
  return this.model('Task').find({ completed: true }, cb);
};


taskSchema.statics.CompleteTaskByStatics = function () {
  return this.find({ completed: false });
};


module.exports = mongoose.model("Task", taskSchema);
