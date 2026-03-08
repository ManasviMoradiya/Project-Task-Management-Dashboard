const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const { protect } = require('../middleware/auth');
const taskRouter = require('./tasks');
const router = express.Router();
router.use('/:projectId/tasks', taskRouter);
router.use(protect);
router
  .route('/')
  .get(getProjects)
  .post(
    [body('name', 'Project name is required').not().isEmpty()],
    createProject
  );

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;

