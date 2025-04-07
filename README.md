# 📝 Advanced React To-Do Application

A feature-rich, responsive To-Do list application built with **React**, **Redux**, and **JavaScript**, showcasing API integration, advanced state management, and user authentication simulation. Designed with a mobile-first approach and best practices in mind.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [Screenshots](#screenshots)
- [Project Structure & Best Practices](#project-structure--best-practices)

---

## ✨ Features

### ✅ Core Functionalities
- **Add Task** – Add tasks using a text field with a button or `Enter` key.
- **View Tasks** – Display all tasks in a clean list format.
- **Delete Task** – Remove tasks with a delete button.
- **Task Prioritization** – Set task priority (High, Medium, Low) and color-code display.
- **Persistent Storage** – Store tasks and auth state in local/session storage.

### ⚛️ React & Redux
- Functional components using `useState` and `useEffect`.
- Global state handling using **Redux Toolkit**.
- Async operations handled with **Redux Thunk**.

### 🌦️ API Integration
- Integrates with a public API (e.g., OpenWeatherMap) to show weather info for tasks related to outdoor activities.

### 🔐 User Authentication (Mocked)
- Simulated login/logout using Redux without a real backend.
- To-Do list is only accessible to authenticated (mocked) users.

### 📦 Persistent Storage
- Tasks and authentication state are stored in **localStorage**, ensuring persistence across sessions.

### 🎨 Theming Support
- Includes a theme toggle via `themeSlice` in Redux.

### 💻 Responsive Design
- Mobile-first approach with **Flexbox** and **CSS Grid**.
- Optimized for all screen sizes (mobile, tablet, desktop).

---

## 🛠️ Tech Stack

- **Frontend**: React, Typescript (ES6+)
- **Styling**: CSS, Flexbox, Grid, (Optional: Bootstrap/Material-UI)
- **State Management**: Redux Toolkit, Redux Thunk
- **API**: Weather API (e.g., OpenWeatherMap)
- **Storage**: LocalStorage / SessionStorage

---


## 🧱 Folder Structure

src/
├── components/             # UI components
│   ├── Login.tsx
│   ├── Settings.tsx
│   ├── TaskInput.tsx
│   ├── TaskList.tsx
│   └── TodoApp.tsx
├── store/                  # Redux store
│   └── slices/
│       ├── authSlice.ts
│       ├── tasksSlice.ts
│       └── themeSlice.ts
│   └── index.ts
├── types/                  # TypeScript types
│   └── index.ts
├── App.tsx                 # Main app component
├── index.css
├── main.tsx                # App entry point
└── vite-env.d.ts



## 🚀 Getting Started......

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/)
- npm (comes with Node.js)

### 📥 Installation

git clone https://github.com/fromsaurav/Adv-ToDo_Application.git
cd advanced-react-todo
npm install

▶️ **Run the App**

npm run dev

📸 Screenshots
🔐 Login Page

📝 Task List

🌦 Weather API Widget

📱 Mobile View

**🧠 Best Practices Followed**

1.Modular folder structure

2.Separation of logic (Redux slices for tasks, auth, theme)

3.Reusable components

4.TypeScript for type safety

5.LocalStorage integration for persistence

Error handling for async API calls

