To-Do Tracker
Welcome to the To-Do Tracker application! This is a full-stack web application for managing tasks, built with a modern and responsive user interface. This project is ready for deployment.

Features:

User Authentication: Secure sign-up and login with password hashing.

Task Management: Create, read, update, and delete to-do tasks.

Smart Task Organization: Tasks are automatically sorted by deadline and organized into "Active Tasks" and "Completed Tasks" lists.

Deadline Tracking: Set deadlines with a specific date and time for each task.

Responsive UI: A clean, dark-themed interface that is optimized for both desktop and mobile devices.


Color Palette:

The project's design is based on a modern and clean color palette.

#766DA7 (Primary)

#15191E (Background)

#7A9663 (Accent)

#556842 (Secondary Accent)

#A0AE91 (Text/Icon)


Technology Stack
Frontend: React, Vite

Backend: Node.js, Express.js (via Vercel Serverless Functions)

Database: MySQL

Deployment: Vercel

Setup and Installation
Follow these steps to get a local copy of the project running on your machine.

1. Clone the repository
git clone https://github.com/code-with-adhi/To-Do-Tracker.git
cd To-Do-Tracker

2. Install dependencies
npm install

4. Set up your database
Create a MySQL database and a users table and a todos table with the schema we defined.
Of course. Here are the SQL queries to set up your database tables.

You should run these commands in your MySQL client to create the tables that your application uses.

Create the users table
This query creates the users table to store all your user information. The email is set to UNIQUE to ensure each account is distinct, and the id is an auto-incrementing primary key.

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(255)
);
Of course. Here are the SQL queries to set up your database tables.

You should run these commands in your MySQL client to create the tables that your application uses.

Create the users table
This query creates the users table to store all your user information. The email is set to UNIQUE to ensure each account is distinct, and the id is an auto-incrementing primary key.

SQL

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(255)
);

Create the todos table
This query creates the todos table for your tasks. The user_id column is a foreign key that links each task to a specific user, which is a crucial part of the application's functionality.

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    deadline TIMESTAMP NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

Create a .env file in the root of your project with your database credentials.

MYSQL_HOST="your_mysql_host"
MYSQL_PORT="your_mysql_port"
MYSQL_USER="your_mysql_user"
MYSQL_PASSWORD="your_mysql_password"
MYSQL_DATABASE="your_database_name"

5. Run the application
Use the Vercel CLI to run a local development server that hosts both the front-end and back-end.

npx vercel dev
The application will be available at http://localhost:3000.


SPECIAL NOTE: 
When we deploy it in localhost, the deadline we fix will be automatically converted to UTC time. So that while deploying in vercel it will provide the correct time according to the user's location. We don't have to explicitly type the UTC time. For those who are wondering why tie is stored differently in the database, that's the reason.

Deployment
This application is configured for deployment on Vercel. To deploy, simply push your code to your GitHub repository and ensure you have set the correct Environment Variables in your Vercel project dashboard.
