import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    onFilterChange({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex space-x-4">
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="All">All Statuses</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="All">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
};

export default FilterBar;
