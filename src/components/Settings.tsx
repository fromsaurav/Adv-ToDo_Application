// Settings.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types';
// Make sure setPrimaryColor, toggleCompactMode, toggleWeatherDisplay are correctly imported
import { setPrimaryColor, toggleCompactMode, toggleWeatherDisplay } from '../store/slices/themeSlice';
import { X, Save, Cloud, Layout, Palette } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define color mappings for buttons to avoid Tailwind purging dynamic classes
const buttonColorClasses: { [key: string]: string } = {
  indigo: 'bg-indigo-600 hover:bg-indigo-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-green-700',
  red: 'bg-red-600 hover:bg-red-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  pink: 'bg-pink-600 hover:bg-pink-700',
};

// Define color mappings for checkboxes/radio buttons if needed (using text-{color}-600 as example)
// Adjust if you use focus rings or other color elements
const formAccentColorClasses: { [key: string]: string } = {
    indigo: 'text-indigo-600 focus:ring-indigo-500',
    blue: 'text-blue-600 focus:ring-blue-500',
    green: 'text-green-600 focus:ring-green-500',
    red: 'text-red-600 focus:ring-red-500',
    purple: 'text-purple-600 focus:ring-purple-500',
    pink: 'text-pink-600 focus:ring-pink-500',
};


function Settings({ isOpen, onClose }: SettingsProps) {
  const dispatch = useDispatch();
  const { darkMode, compactMode, showWeather, primaryColor } = useSelector(
    (state: RootState) => state.theme
  );

  // Use state to track form values before saving
  const [defaultPriority, setDefaultPriority] = useState('Medium');
  const [selectedColor, setSelectedColor] = useState(primaryColor);
  const [isCompact, setIsCompact] = useState(compactMode);
  const [showWeatherInfo, setShowWeatherInfo] = useState(showWeather);

  // Initialize form values from localStorage or redux state when the modal opens
  useEffect(() => {
    const savedPriority = localStorage.getItem('defaultPriority');
    if (savedPriority) {
      setDefaultPriority(savedPriority);
    } else {
        setDefaultPriority('Medium'); // Ensure a default if nothing is saved
    }

    // Sync local state with Redux state when the modal opens or relevant redux state changes
    setIsCompact(compactMode);
    setShowWeatherInfo(showWeather);
    setSelectedColor(primaryColor);

  }, [isOpen, compactMode, showWeather, primaryColor]); // Dependency array is correct

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    // Save priority to localStorage (consider if this should be in Redux later)
    localStorage.setItem('defaultPriority', defaultPriority);

    // Dispatch Redux actions ONLY if the value actually changed
    if (selectedColor !== primaryColor) {
      dispatch(setPrimaryColor(selectedColor));
    }

    // Since the actions are toggles, dispatching them when the state differs
    // will correctly flip the Redux state to match the desired local state.
    if (isCompact !== compactMode) {
      dispatch(toggleCompactMode());
    }

    if (showWeatherInfo !== showWeather) {
      dispatch(toggleWeatherDisplay());
    }

    onClose(); // Close the modal after saving
  };

  const colors = [
    { name: 'indigo', class: 'bg-indigo-600' },
    { name: 'blue', class: 'bg-blue-600' },
    { name: 'green', class: 'bg-green-600' },
    { name: 'red', class: 'bg-red-600' },
    { name: 'purple', class: 'bg-purple-600' },
    { name: 'pink', class: 'bg-pink-600' },
  ];

  // Get the current accent color class for form elements
  const currentAccentColorClass = formAccentColorClasses[selectedColor] || formAccentColorClasses['indigo'];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Added padding for smaller screens */}
      <div className={`${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900' // Ensure text color contrast
      } rounded-lg shadow-xl p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Settings</h2> {/* Changed font-bold to font-semibold */}
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} transition-colors`} // Improved styling
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Task Defaults Section */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Palette className="h-5 w-5 mr-2 opacity-80" /> {/* Added opacity */}
              Task Defaults
            </h3>
            <div className="space-y-2">
              <label htmlFor="defaultPrioritySelect" className="block text-sm font-medium"> {/* Added htmlFor and specific label styling */}
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Default Priority
                </span>
              </label>
              <select
                id="defaultPrioritySelect" // Added id
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' // Ensure dark mode focus matches theme
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500' // Use primary color for focus
                }`}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Theme Color Section */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Palette className="h-5 w-5 mr-2 opacity-80" />
              Primary Color
            </h3>
            <div className="grid grid-cols-6 gap-3"> {/* Increased gap slightly */}
              {colors.map(color => (
                <button
                  key={color.name}
                  type="button" // Explicitly set type
                  className={`${color.class} h-8 w-8 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ring-offset-1 ${darkMode ? 'ring-offset-gray-800' : 'ring-offset-white'} ${
                    selectedColor === color.name ? 'ring-2 ring-opacity-75 ring-current' : 'hover:scale-110' // Use ring-current and hover effect
                  }`}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Set primary color to ${color.name}`}
                >
                   {/* Optional: Add a checkmark for selected color */}
                   {/* {selectedColor === color.name && <Check className="h-4 w-4 text-white" />} */}
                </button>
              ))}
            </div>
          </div>

          {/* Display Options Section */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Layout className="h-5 w-5 mr-2 opacity-80" />
              Display Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCompact}
                  onChange={() => setIsCompact(!isCompact)}
                  className={`rounded shadow-sm focus:ring-offset-0 ${currentAccentColorClass} ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`} // Applied theme color and dark mode styling
                />
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Compact Mode</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWeatherInfo}
                  onChange={() => setShowWeatherInfo(!showWeatherInfo)}
                  className={`rounded shadow-sm focus:ring-offset-0 ${currentAccentColorClass} ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`} // Applied theme color and dark mode styling
                />
                <span className={`ml-2 flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Cloud className="h-4 w-4 mr-1.5 opacity-70" /> {/* Adjusted margin and opacity */}
                  Show Weather Information
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3"> {/* Increased top margin */}
          <button
            type="button" // Explicitly set type
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              darkMode
                ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            type="button" // Explicitly set type
            onClick={handleSaveSettings}
            // Use the buttonColorClasses mapping for static classes
            className={`flex items-center px-4 py-2 ${buttonColorClasses[selectedColor] || buttonColorClasses['indigo']} text-white rounded-md text-sm font-medium transition-colors shadow-sm`}
          >
            <Save className="h-5 w-5 mr-1.5" /> {/* Adjusted margin */}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;