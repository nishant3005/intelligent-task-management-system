import React from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const TaskList = ({ tasks }) => {
  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
          <p className="text-gray-600 mb-2">{task.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            <span>Priority: {task.priority}</span>
          </div>
          <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {task.status}
          </div>
          <button
            onClick={() => handleDelete(task._id)}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
