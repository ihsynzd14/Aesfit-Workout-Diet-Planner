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
- **Database**: [MongoDB Cloud Cluster](https://www.mongodb.com/cloud/atlas)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ihsynzd14/Aesfit-Workout-Diet-Planner
    ```

2. Install dependencies for both the frontend and backend:

    ```bash
    cd aesfit-workout-diet-planner
    npm install
    ```

3. Set up MongoDB Cloud Cluster:
   - Create a MongoDB Atlas account [here](https://www.mongodb.com/cloud/atlas).
   - Create a cluster and get your MongoDB connection string.
   - Whitelist your IP address to allow connections.

4. Create a `.env.local` file and add your environment variables:

    ```bash
    NEXT_PUBLIC_API_URL=http://yourapi.com
    MONGODB_URI=your_mongodb_connection_string
    SECRET_KEY=your_secret_key
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Open your browser and go to `http://localhost:3000` to see the app in action.

## MongoDB Configuration

Ensure your MongoDB Cloud Cluster is properly set up by following these steps:

1. Go to the MongoDB Atlas dashboard and create a new database cluster.
2. Add your database user credentials.
3. Use the connection string in your `.env.local` file:

    ```bash
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
    ```

4. You can manage your database from the MongoDB dashboard or through MongoDB Compass.

## Contributing

Feel free to open issues or create pull requests to help improve the project. Contributions are always welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
