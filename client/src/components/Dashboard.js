import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import io from 'socket.io-client';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useNavigate } from 'react-router-dom';
import Navbar from './ui/Navbar';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import api from '../utils/api';

const socket = io('http://localhost:5001');

function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
  });
  useEffect(() => {
    fetchTasks();

    socket.on('taskCreated', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    socket.on('taskDeleted', (deletedTaskId) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== deletedTaskId)
      );
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  useEffect(() => {
    applyFilters('', filters);
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    applyFilters(searchTerm, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = (searchTerm, currentFilters) => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (currentFilters.status !== 'All') {
      filtered = filtered.filter(
        (task) => task.status === currentFilters.status
      );
    }

    if (currentFilters.priority !== 'All') {
      filtered = filtered.filter(
        (task) => task.priority === currentFilters.priority
      );
    }

    setFilteredTasks(filtered);
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome, {user.firstName}!
        </h1>
        <TaskForm onTaskCreated={(newTask) => setTasks([...tasks, newTask])} />
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex-1">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <TaskList tasks={filteredTasks} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
