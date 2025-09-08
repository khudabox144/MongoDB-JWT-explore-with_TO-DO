const Task = require("../models/Task");
const router = require("../routes/taskRoutes");

//Get all tasks
exports.GetTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render("index", { 
      tasks, 
      username: req.username || null 
    });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).send("Error fetching tasks");
  }
};


//Completed task
exports.CompletedTask = async (req, res) => {
  const todo = new Task();
  const data = await todo.completedMethod();
  try {
    res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while completing the task.",
      error: err.message, // optional: show error details
    });
  }
};


//completedTask with callback function 
exports.CompletedTaskwithCallback=(req,res)=>{
    const todo=new Task();
    todo.completedMethodCb((err,data)=>{
        res.status(200).json({
            data,
        })
    })
}

// alias to match route name '/completedTaskwithCb'
exports.CompletedTaskwithCb = exports.CompletedTaskwithCallback;



//CompleteTaskByStatics with static method

exports.complete=async(req,res)=>{
    try {
    const tasks = await Task.CompleteTaskByStatics(); // call static method
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// alias to match route name '/completed' -> taskController.CompleteTaskByStatics
exports.CompleteTaskByStatics = exports.complete;



//Add a task
exports.addTask = async (req, res) => {
  await Task.create({ title: req.body.title });
  //   const todo = new Task(req.body);
  //   todo.createdAt = new Date(); // extra logic before saving
  //   await todo.save();

  res.redirect("/");
};

// if i use callback function then i dont need to use async , await , after using callback
//async and await are reduntdend

// here i used  callback function

// POST MULTIPLE TODO

// exports.addManytask=async(req,res)=>{
//     await Task.insertMany(req.body,(err)=>{
//         if(err){
//             res.status(500).json({
//                 error: 'There was a server side error'
//             });
//         }
//         else{
//             res.status(200).json({
//                 message:"Todos were inserted Successfully ",
//             })
//         }
//     })
// }

// update using the updateOne

// router.put("/:id", async (req, res) => {
//   await Task.updateOne(
//     { _id: req.params.id },
//     {
//       $set: {
//         status: "active",
//       },
//     },
//     (err) => {
//       if (err) {
//         res.status(500).json({
//           error: "There was a server side error",
//         });
//       } else {
//         res.status(200).json({
//           message: "Todos were inserted Successfully ",
//         });
//       }
//     }
//   );
// });

// here i used async and await

// router.get('/:id',async(req,res)=>{
//     try{
//         const data=await Task.find({_id:req.params.id});
//         res.status(200).json({
//             result:data,
//             message:'success',
//         });
//     }
//     catch{
//         res.status(500).json({
//             error:'there was a server side error',
//         })
//     }
// })

// Mark a task as completed
exports.completedTask = async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect("/");
};

//Delete Task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/");
};

// const NewTodo=new Task(req.body);
// await NewTodo.save((err)=>{

// });
