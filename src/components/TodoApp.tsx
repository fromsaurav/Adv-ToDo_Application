import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../types';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { setFilter, setSortBy } from '../store/slices/tasksSlice';
import TaskInput from './TaskInput';
import TaskList from './TaskList';
import Settings from './Settings';
import { LogOut, Settings as SettingsIcon, Sun, Moon, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TodoApp() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode, primaryColor, compactMode } = useSelector((state: RootState) => state.theme);
  const { user } = useSelector((state: RootState) => state.auth);
  const { filter, sortBy } = useSelector((state: RootState) => state.tasks);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Apply the primary color to components
  const getPrimaryColorClass = (element: 'bg' | 'text' | 'hover' | 'border' | 'ring') => {
    return `${element}-${primaryColor}-600`;
  };
  
  const getHoverColorClass = () => {
    return `hover:${getPrimaryColorClass('bg')}`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className={`container mx-auto px-4 ${compactMode ? 'py-4' : 'py-8'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <CheckSquare className={`h-8 w-8 ${getPrimaryColorClass('text')}`} />
            <h1 className="text-3xl font-bold">TaskMaster Pro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg ${compactMode ? 'p-4' : 'p-6'}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => dispatch(setFilter(e.target.value as 'all' | 'active' | 'completed'))}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Tasks</option>
                <option value="active">Active Tasks</option>
                <option value="completed">Completed Tasks</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value as 'newest' | 'oldest' | 'deadline'))}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="deadline">By Deadline</option>
              </select>
            </div>
          </div>
          <TaskInput />
          <TaskList />
        </div>
      </div>
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default TodoApp;