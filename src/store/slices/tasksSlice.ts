import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TasksState } from '../../types';

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  filter: 'all',
  sortBy: 'newest'
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'newest' | 'oldest' | 'deadline'>) => {
      state.sortBy = action.payload;
    }
  },
});

export const { addTask, removeTask, toggleTask, setTasks, setFilter, setSortBy } = tasksSlice.actions;
export default tasksSlice.reducer;