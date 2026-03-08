const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} = require('../controllers/taskController');

const { protect } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });
router.use(protect);
router
  .route('/')
  .get(getTasks)
  .post(
    [body('title', 'Task title is required').not().isEmpty()],
    createTask
  );

router.put('/reorder', reorderTasks);
router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);
  
module.exports = router;

