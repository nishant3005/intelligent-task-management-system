import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Task name is required'),
  description: Yup.string(),
  dueDate: Yup.date().min(new Date(), 'Due date must be in the future'),
  priority: Yup.string().oneOf(['Low', 'Medium', 'High'], 'Invalid priority'),
  status: Yup.string().oneOf(
    ['To Do', 'In Progress', 'Done'],
    'Invalid status'
  ),
});

const TaskForm = ({ onTaskCreated }) => {
  const [task, setTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'To Do',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(task, { abortEarly: false });
      const response = await api.post('/tasks', task);
      onTaskCreated(response.data);
      setTask({
        name: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'To Do',
      });
      toast.success('Task created successfully!');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error('Error creating task:', error);
        toast.error('Failed to create task. Please try again.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.name ? 'border-red-500' : ''
          }`}
          type="text"
          name="name"
          value={task.name}
          onChange={handleChange}
          placeholder="Task name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name}</p>
        )}
      </div>
      {/* Add similar error handling for other fields */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
