// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './types';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import { loginSuccess } from './store/slices/authSlice';
import { setTasks } from './store/slices/tasksSlice';
import { setThemeState } from './store/slices/themeSlice'; // <-- Import the new action

function App() {
  const dispatch = useDispatch();
  // Get darkMode AFTER potentially loading from localStorage
  const { darkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    // Check for saved user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            dispatch(loginSuccess(JSON.parse(savedUser)));
        } catch (e) {
            console.error("Failed to parse saved user:", e);
            localStorage.removeItem('user'); // Clear invalid data
        }
    }

    // Load saved tasks
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        try {
            dispatch(setTasks(JSON.parse(savedTasks)));
        } catch (e) {
            console.error("Failed to parse saved tasks:", e);
            localStorage.removeItem('tasks'); // Clear invalid data
        }
    }

    // *** Load saved theme settings ***
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        try {
            const parsedTheme = JSON.parse(savedTheme);
            // Dispatch action to update Redux state with loaded theme
            dispatch(setThemeState(parsedTheme));
        } catch (e) {
            console.error("Failed to parse saved theme settings:", e);
            localStorage.removeItem('theme'); // Clear invalid data
        }
    }
    // Optional: Set dark mode based on system preference if no saved theme
    // else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   dispatch(setThemeState({ darkMode: true }));
    // }

  }, [dispatch]); // Dispatch should be stable, so this runs once on mount

  // Apply dark class to HTML element for global styling (recommended practice)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    // Use template literal correctly for className
    // The min-h-screen and background colors are often better applied to the body or html via index.css/global css
    // but applying here works too. Removed bg colors as they should now be controlled by the 'dark' class on <html>
    <div className={`min-h-screen ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TodoApp />
              </PrivateRoute>
            }
          />
          {/* Optional: Redirect base path if needed */}
           <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  // Could add a loading state check here as well if auth check is async
  return user?.isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />; // Added replace prop
}

export default App;