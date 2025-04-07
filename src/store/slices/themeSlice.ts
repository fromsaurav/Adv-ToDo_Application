// /store/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'; // Import PayloadAction
import { ThemeState } from '../../types';

const initialState: ThemeState = {
  darkMode: false, // Consider detecting system preference here initially
  primaryColor: 'indigo',
  compactMode: false,
  showWeather: true
};

// Helper function to safely update localStorage
const saveThemeToLocalStorage = (state: ThemeState) => {
  try {
    localStorage.setItem('theme', JSON.stringify(state));
  } catch (e) {
    console.error("Could not save theme to localStorage", e);
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Action to initialize or hydrate the state from localStorage
    setThemeState: (state, action: PayloadAction<Partial<ThemeState>>) => {
        // Merge the loaded state with the initial state carefully
        // Use nullish coalescing (??) to fall back to initial values if a property is missing
        state.darkMode = action.payload.darkMode ?? initialState.darkMode;
        state.primaryColor = action.payload.primaryColor ?? initialState.primaryColor;
        state.compactMode = action.payload.compactMode ?? initialState.compactMode;
        state.showWeather = action.payload.showWeather ?? initialState.showWeather;
    },
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      saveThemeToLocalStorage(state); // Use helper
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => { // Add PayloadAction type
      state.primaryColor = action.payload;
      saveThemeToLocalStorage(state); // Use helper
    },
    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode;
      saveThemeToLocalStorage(state); // Use helper
    },
    toggleWeatherDisplay: (state) => {
      state.showWeather = !state.showWeather;
      saveThemeToLocalStorage(state); // Use helper
    },
  },
});

// Export the new action along with the others
export const { setThemeState, toggleTheme, setPrimaryColor, toggleCompactMode, toggleWeatherDisplay } = themeSlice.actions;
export default themeSlice.reducer;