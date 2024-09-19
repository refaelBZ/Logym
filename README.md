# Logym

Logym is a simple and efficient fitness tracking platform designed to help users monitor their workout progress, track performance, and stay motivated with clear, visual feedback. Built with a focus on user experience, it allows for real-time input of workout data and provides insightful progress tracking through graphs and percentages.

## Problem Statement

Many users struggle to keep track of their workout progress at the gym. Forgetting details like weights, reps, and sets can lead to wasted time and frustration. Current fitness apps tend to be overly complex, with confusing interfaces that make tracking progress unnecessarily difficult.

## Solution

Logym provides a streamlined interface where users can:
- Select their daily workout and log sets, reps, weight, and effort in real-time.
- Review past performances, including weights, sets, and reps from previous sessions.
- Monitor progress through clear, user-friendly graphs that track improvements over time.
- Get a visual overview of achievements, making it easier to stay motivated and focused.

## Technologies Used

### Frontend

- **React.js**: Modular, component-based architecture with reusable and dynamic components, avoiding hard-coded values. This allows for scalable code and efficient updates. Hooks like `useState` and `useEffect` are used to manage UI states and application logic. React Router is used for navigation between pages.
- **SCSS**: Modularized CSS for consistent, scalable, and responsive design. SCSS mixins and variables help ensure reusability across the application, optimized for mobile.
- **Axios**: Manages HTTP requests to the backend, handling authentication tokens for secure data access.
- **React Context API**: Manages global state for user authentication and workout data, simplifying the sharing of data across components without excessive prop drilling.

### Backend

- **Node.js & Express.js**: RESTful API structure for handling authentication and workout management with an MVC pattern for separation of concerns.
- **Mongoose**: Interacts with **MongoDB**, a NoSQL database, to store workout data with flexible schemas for users, workouts, and exercises.
- **JWT & Bcrypt.js**: Secure user authentication using JWT for session management and Bcrypt for password hashing.

### Database

- **MongoDB**: NoSQL database with a schema that supports user-workout relationships and stores complex workout structures (e.g., exercises, sets, reps, weights).
