import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../store/slices/tasksSlice';
import { RootState } from '../types';
import { Plus, Calendar, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';

// Sample location data - in a real app, you might fetch this from an API
const locationSuggestions = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco',
  'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington DC',
  'Boston', 'Nashville', 'Baltimore', 'Oklahoma City', 'Portland',
  'Las Vegas', 'Milwaukee', 'Albuquerque', 'Tucson', 'Sacramento',
  'London', 'Paris', 'Tokyo', 'Berlin', 'Madrid', 'Rome', 'Moscow',
  'Sydney', 'Melbourne', 'Toronto', 'Vancouver', 'Montreal', 'Cairo',
  'Dubai', 'Singapore', 'Hong Kong', 'Bangkok', 'Mumbai', 'Delhi'
];

function TaskInput() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { darkMode, primaryColor, compactMode } = useSelector((state: RootState) => state.theme);
  
  // Get today's date in YYYY-MM-DDThh:mm format for the min attribute of datetime-local input
  const today = new Date();
  const minDate = format(today, "yyyy-MM-dd'T'HH:mm");

  useEffect(() => {
    const savedPriority = localStorage.getItem('defaultPriority');
    if (savedPriority) {
      setPriority(savedPriority as 'High' | 'Medium' | 'Low');
    }
  }, []);

  useEffect(() => {
    // Filter locations based on input
    if (location.trim()) {
      const filtered = locationSuggestions.filter(loc => 
        loc.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [location]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        locationInputRef.current && 
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setShowSuggestions(true);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Create base task object without weather data
    const baseTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline,
      location: location.trim() || undefined,
    };

    // Only attempt to fetch weather if location is provided
    if (location.trim()) {
      try {
        // Real weather API call
        const weatherResponse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${encodeURIComponent(location)}`);
        const weatherData = await weatherResponse.json();

        if (weatherData.error) {
          // Handle API error like invalid location
          console.error('Weather API Error:', weatherData.error);
          dispatch(addTask(baseTask));
        } else {
          // Add weather data to task
          const taskWithWeather = {
            ...baseTask,
            weather: {
              temp: weatherData.current.temp_c,
              condition: weatherData.current.condition.text,
              icon: weatherData.current.condition.icon,
            }
          };
          dispatch(addTask(taskWithWeather));
        }
      } catch (error) {
        console.error('Weather API Error:', error);
        dispatch(addTask(baseTask));
      }
    } else {
      // No location provided, just add the base task
      dispatch(addTask(baseTask));
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(localStorage.getItem('defaultPriority') as 'High' | 'Medium' | 'Low' || 'Medium');
    setLocation('');
    setDeadline('');
    setShowSuggestions(false);
  };

  const clearLocation = () => {
    setLocation('');
    locationInputRef.current?.focus();
  };

  // Apply compact mode styles
  const inputPadding = compactMode ? 'py-1' : 'py-2';
  const inputTextSize = compactMode ? 'text-xs' : 'text-sm sm:text-base';
  const spacing = compactMode ? 'space-y-2' : 'space-y-3 sm:space-y-4';
  const buttonPadding = compactMode ? 'px-3 py-1' : 'px-4 sm:px-6 py-2';

  return (
    <form onSubmit={handleSubmit} className={`mb-4 ${spacing} w-full max-w-4xl mx-auto px-2 sm:px-0`}>
      {/* Title and Priority - Stack on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className={`w-full px-3 sm:px-4 ${inputPadding} ${inputTextSize} rounded-lg border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500`}
        />
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
          className={`w-full px-3 sm:px-4 ${inputPadding} ${inputTextSize} rounded-lg border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500`}
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* Description - Full width on all screen sizes */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        rows={compactMode ? 2 : 3}
        className={`w-full px-3 sm:px-4 ${inputPadding} ${inputTextSize} rounded-lg border ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500`}
      />

      {/* Location and Calendar - Stack on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="relative">
          <MapPin className={`absolute left-3 top-${compactMode ? '1.5' : '2.5'} h-4 w-4 sm:h-5 sm:w-5 text-gray-400`} />
          <input
            ref={locationInputRef}
            type="text"
            value={location}
            onChange={handleLocationChange}
            onFocus={() => location.trim() && setShowSuggestions(true)}
            placeholder="Location (for weather)"
            className={`w-full pl-9 sm:pl-12 pr-8 sm:pr-12 ${inputPadding} ${inputTextSize} rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500`}
          />
          {location && (
            <button
              type="button"
              onClick={clearLocation}
              className={`absolute right-3 top-${compactMode ? '1.5' : '2.5'} text-gray-400 hover:text-gray-600 focus:outline-none`}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
          
          {/* Location suggestions grid - more columns on larger screens */}
          {showSuggestions && filteredLocations.length > 0 && (
            <div 
              ref={suggestionRef}
              className={`absolute z-20 mt-1 w-full rounded-md shadow-lg ${
                darkMode ? 'bg-gray-700' : 'bg-white'
              } max-h-52 sm:max-h-60 overflow-y-auto`}
            >
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1 p-2">
                {filteredLocations.map((loc, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(loc)}
                    className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md truncate ${
                      darkMode 
                        ? 'hover:bg-gray-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Calendar className={`absolute left-3 top-${compactMode ? '1.5' : '2.5'} h-4 w-4 sm:h-5 sm:w-5 text-gray-400`} />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={minDate}
            className={`w-full pl-9 sm:pl-12 pr-3 sm:pr-4 ${inputPadding} ${inputTextSize} rounded-lg border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500`}
          />
        </div>
      </div>

      {/* Submit button - Full width on mobile, right-aligned on larger screens */}
      <div className="flex sm:justify-end mt-4">
        <button
          type="submit"
          className={`w-full sm:w-auto flex items-center justify-center ${buttonPadding} bg-${primaryColor}-600 text-white ${inputTextSize} rounded-lg hover:bg-${primaryColor}-700 transition-colors duration-200`}
        >
          <Plus className={`h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2`} />
          Add Task
        </button>
      </div>
    </form>
  );
}

export default TaskInput;