export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  createdAt: string;
  deadline: string;
  weather?: {
    temp: number;
    condition: string;
    icon: string;
  };
  location?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';
  sortBy: 'newest' | 'oldest' | 'deadline';
}

export interface ThemeState {
  darkMode: boolean;
  primaryColor: string;
  compactMode: boolean;
  showWeather: boolean;
}

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
  theme: ThemeState;
}