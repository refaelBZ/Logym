# Logym

Logym is a simple and efficient mobile web application, originally conceptualized, designed, and fully developed by me as a fullstack project. It helps users monitor their workout progress, track performance, and stay motivated with clear, visual feedback. Built from scratch with a focus on user experience, it allows for real-time input of workout data and provides insightful progress tracking through graphs and daily scores.

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
- **SCSS**: Built from scratch with custom mixins and variables to ensure a responsive, scalable, and mobile-first design. No existing templates were used—all UI/UX design is original and designed for maximum usability.
- 
### Backend

- **Node.js & Express.js**: RESTful API structure for handling authentication and workout management with an MVC pattern for separation of concerns.
- **Mongoose**: Interacts with **MongoDB**, a NoSQL database, to store workout data with flexible schemas for users, workouts, and exercises.
- **JWT & Bcrypt.js**: Secure user authentication using JWT for session management and Bcrypt for password hashing.

### Database

- **MongoDB**: NoSQL database with a schema that supports user-workout relationships and stores complex workout structures (e.g., exercises, sets, reps, weights).

## Live Demo

- Since environment variables (ENVs) are not exposed in the repository, you can access the live demo via the following link: [Logym](https://logym.vercel.app/)

## Installation

To set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/refaelBZ/Logym.git
   ```

2. Navigate to the client folder, install dependencies by, and run the app:

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. For the server:

   ```bash
   cd server
   npm install
   npm run dev
   ```

4. Set up environment variables in a `.env` file:

   ```bash
   MONGODB_URI=<replace-with-your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```
