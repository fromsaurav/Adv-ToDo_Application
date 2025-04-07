import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { RootState, Task } from '../types';
import { removeTask, toggleTask } from '../store/slices/tasksSlice';
import { Trash2, CheckCircle, Circle, MapPin, Cloud, Clock, Calendar} from 'lucide-react';

function TaskList() {
  const dispatch = useDispatch();
  const { tasks, filter, sortBy } = useSelector((state: RootState) => state.tasks);
  const { darkMode, showWeather, compactMode, primaryColor } = useSelector((state: RootState) => state.theme);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'deadline') {
      // Handle tasks without deadlines
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0;
  });

  const completedTasksCount = tasks.filter(task => task.completed).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const renderTask = (task: Task) => (
    <div
      key={task.id}
      className={`${
        darkMode ? 'bg-gray-700' : 'bg-white'
      } rounded-lg shadow-md ${compactMode ? 'p-3 mb-3' : 'p-4 mb-4'} transition-all duration-200 hover:shadow-lg ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => dispatch(toggleTask(task.id))}
            className="mt-1 focus:outline-none"
          >
            {task.completed ? (
              <CheckCircle className={`h-6 w-6 text-${primaryColor}-500`} />
            ) : (
              <Circle className="h-6 w-6 text-gray-400" />
            )}
          </button>
          <div>
            <h3
              className={`${compactMode ? 'text-base' : 'text-lg'} font-medium ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className={`${compactMode ? 'mt-0.5 text-sm' : 'mt-1'} text-gray-500`}>
                {task.description}
              </p>
            )}
            <div className={`${compactMode ? 'mt-1 text-xs' : 'mt-2 text-sm'} text-gray-500 space-y-0.5`}>
              <div className="flex items-center space-x-2">
                <Clock className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <span>Created: {format(new Date(task.createdAt), compactMode ? 'PP' : 'PPp')}</span>
              </div>
              {task.deadline && (
                <div className="flex items-center space-x-2">
                  <Calendar className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  <span>Due: {format(new Date(task.deadline), compactMode ? 'PP' : 'PPp')}</span>
                </div>
              )}
              {showWeather && task.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  <span>{task.location}</span>
                </div>
              )}
              {showWeather && task.weather && (
                <div className="flex items-center space-x-2">
                  <Cloud className={`${compactMode ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  <span>
                    {task.weather.temp}°C - {task.weather.condition}
                  </span>
                  {task.weather.icon && (
                    <img 
                      src={`https:${task.weather.icon}`} 
                      alt={task.weather.condition}
                      className={`${compactMode ? 'h-4 w-4' : 'h-6 w-6'}`}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`${compactMode ? 'text-xs' : 'text-sm'} font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <button
            onClick={() => dispatch(removeTask(task.id))}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            <Trash2 className={`${compactMode ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
        <span>Total Tasks: {tasks.length}</span>
        <span>Completed: {completedTasksCount}</span>
      </div>
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No tasks yet. Add one above!</p>
        ) : (
          sortedTasks.map(renderTask)
        )}
      </div>
    </div>
  );
}

export default TaskList;