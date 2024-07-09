const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'] },
  createdBy: { type: String, required: true }, // Clerk user ID
  collaborators: [{ type: String }], // Array of Clerk user IDs
});

module.exports = mongoose.model('Task', TaskSchema);
