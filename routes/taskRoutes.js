
const express = require('express');
const router=express.Router();
const taskController=require('../controllers/taskController');
const checkLogin = require('../middleware/loginCheck');

router.get('/', checkLogin, taskController.GetTasks);
router.post('/add', checkLogin, taskController.addTask);
router.get('/complete/:id',taskController.completedTask);
router.get('/delete/:id',taskController.deleteTask);
router.get('/completedTask',taskController.CompletedTask);
router.get('/completedTaskwithCb', taskController.CompletedTaskwithCallback);
router.get('/completed', taskController.CompleteTaskByStatics);


module.exports=router;