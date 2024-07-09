const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

module.exports = (io, ClerkExpressRequireAuth) => {
  // Apply the middleware to all routes
  router.use(ClerkExpressRequireAuth);

  // Create a new task
  router.post('/', async (req, res) => {
    try {
      const task = new Task({
        ...req.body,
        createdBy: req.user.userId,
      });
      await task.save();
      io.emit('taskCreated', task);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all tasks for the current user
  router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find({
        $or: [
          { createdBy: req.user.userId },
          { collaborators: req.user.userId },
        ],
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update a task
  router.patch('/:id', async (req, res) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        createdBy: req.user.userId,
      });
      if (!task) {
        return res.status(404).json({
          message: 'Task not found or you do not have permission to update it',
        });
      }
      Object.assign(task, req.body);
      await task.save();
      io.emit('taskUpdated', task);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a task
  router.delete('/:id', async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.userId,
      });
      if (!task) {
        return res.status(404).json({
          message: 'Task not found or you do not have permission to delete it',
        });
      }
      io.emit('taskDeleted', req.params.id);
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Share a task
  router.post('/:id/share', async (req, res) => {
    try {
      const { collaboratorId } = req.body;
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.userId },
        { $addToSet: { collaborators: collaboratorId } },
        { new: true }
      );
      if (!task) {
        return res.status(404).json({
          message: 'Task not found or you do not have permission to share it',
        });
      }
      io.emit('taskUpdated', task);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  return router;
};
