# Aesfit Workout/Diet Planner

Aesfit is a full-stack workout and diet planning application built with **Next.js** and **Node.js**. It allows users to search for workout exercises, explore diet plans, and calculate various health metrics like BMI, body fat percentage, and more.

## Features

- 🔍 **Search Workouts**: Browse a variety of workout exercises based on different goals, body parts, and intensity levels.
- 🍽️ **Diet Plans**: Explore personalized diet plans for different fitness goals such as weight loss, muscle gain, or maintenance.
- 🧮 **Health Metrics Calculator**: Calculate essential health metrics such as BMI (Body Mass Index), body fat percentage, calorie needs, and more.
- 📈 **Track Your Progress**: Keep track of your fitness progress and update your workout/diet plans as you go.
  
## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [Node.js](https://nodejs.org/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/aesfit-workout-diet-planner.git
    ```

2. Install dependencies for both the frontend and backend:

    ```bash
    cd aesfit-workout-diet-planner
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your browser and go to `http://localhost:3000` to see the app in action.

## Environment Variables

Make sure to set the following environment variables in a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://yourapi.com
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
