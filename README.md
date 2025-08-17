# To-Do Tracker 

A full-stack web application designed for efficient task management. Built with a modern tech stack, this project features a clean, responsive, dark-themed UI and is ready for deployment on Vercel.



---

##  Live Demo

Here is the full functional To-Do-Tracker

[View Live Demo](https://to-do-tracker-by-adhi.vercel.app)

---

##  Features

*  **User Authentication:** Secure sign-up and login functionality with password hashing.
*  **CRUD Operations:** Create, read, update, and delete your to-do tasks effortlessly.
*  **Smart Task Organization:** Tasks are automatically sorted by the nearest deadline and separated into "Active" and "Completed" lists.
*  **Deadline Tracking:** Assign a specific date and time to each task to stay on track.
*  **Responsive UI:** A sleek, dark-themed interface optimized for a seamless experience on both desktop and mobile devices.

---

## Technology Stack

* **Frontend:** React, Vite
* **Backend:** Node.js, Express.js (as Vercel Serverless Functions)
* **Database:** MySQL
* **Deployment:** Vercel

---

## Getting Started

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [MySQL](https://www.mysql.com/downloads/)
* [Vercel CLI](https://vercel.com/docs/cli)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/code-with-adhi/To-Do-Tracker.git
    cd To-Do-Tracker
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up the database:**
    Connect to your MySQL instance and run the following SQL queries to create the necessary tables.

    * **Create `users` table:**
        ```sql
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            username VARCHAR(255)
        );
        ```

    * **Create `todos` table:**
        ```sql
        CREATE TABLE todos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            task VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            deadline TIMESTAMP NULL,
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project and add your database credentials.
    ```env
    MYSQL_HOST="your_mysql_host"
    MYSQL_PORT="your_mysql_port"
    MYSQL_USER="your_mysql_user"
    MYSQL_PASSWORD="your_mysql_password"
    MYSQL_DATABASE="your_database_name"
    ```

### Run Locally

Use the Vercel CLI to run the local development server, which hosts both the frontend and the serverless backend functions.

```sh
npx vercel dev
```

---
**Note on Timezone**

The application is designed to automatically handle timezones. When you set a deadline, it is converted to UTC before being stored in the database. This ensures that when deployed,
the deadline displays correctly according to each user's local timezone.

---

**Deployment**
This application is pre-configured for easy deployment on Vercel.

* Push your code to a GitHub repository.

* Import the repository into your Vercel dashboard.

* Add the same environment variables from your .env file to the Vercel project settings.

* Vercel will automatically build and deploy your application. Any subsequent pushes to the main branch will trigger a new deployment.

---
