# TaskFlow - Project and Task Management System

TaskFlow is a full-stack web application designed to help teams organize projects and track tasks efficiently. Built using the MERN stack (MongoDB, Express, React, Node.js), it features an interactive Kanban board, role-based access control, and real-time task status updates.

## Key Features

* **Project Management:** Create, view, and manage multiple projects within a unified dashboard.
* **Kanban Workflow:** A drag-and-drop interface allowing users to move tasks between "Todo," "In Progress," and "Done" stages.
* **Task Assignment:** Searchable dropdown menu to assign tasks to specific registered users.
* **Role-Based Access:**
    * **Regular Users:** Can manage their own projects and view tasks assigned to them.
    * **Admins:** Have global oversight to view all projects in the system and administrative deletion rights.
* **My Tasks View:** A filtered list showing only the tasks assigned to the currently logged-in user across all projects.
* **Secure Authentication:** User registration and login protected by JWT (JSON Web Tokens) and password hashing.

## Technology Stack

**Frontend:**
* React.js
* Tailwind CSS (Styling)
* Lucide React (Icons)
* React Router DOM (Navigation)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JsonWebToken (Authentication)
* Bcryptjs (Security)

## Prerequisites

Before running the application, ensure you have the following installed:
* Node.js (v14 or newer)
* MongoDB (Local instance or Atlas connection string)
* Git

## Installation and Setup

### 1. Clone the Repository
git clone <repository_url>
cd Task-Manager

### 2. Backend Configuration

Navigate to the backend directory and install the necessary dependencies.
Bash

cd backend
npm install

### Create a configuration file named .env in the backend folder. Add the following environment variables:
Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_string

### 3. Database Seeding (Important)

This application uses a seeding script to initialize the database with an Admin account. This is required because the standard registration form only creates "Regular User" accounts. To access administrative features, you must run the seeder.

Why is this necessary? The Admin role has special permissions, such as viewing all projects created by any user and deleting content that violates policies. The seeder ensures you have immediate access to these features without manually editing the database documents.

Run the seeder command:

Ensure your MongoDB instance is running, then execute:
Bash

npm run seed

### I have kept default admin email - "admin@example.com" pass - "admin123"


### 4. Start the Backend Server

Start the development server with hot-reloading enabled:
Bash

npm run dev


### 5. Frontend Configuration

Open a new terminal window, navigate to the frontend directory, and install dependencies.
Bash

cd ../frontend
npm install

### start the React application:
Bash

npm run dev
