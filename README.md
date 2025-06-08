# Simple Node.js Todo Application

---

### 📝 Project Overview

This is a simple full-stack Todo application built with Node.js. It allows users to organize their daily tasks, managing them through different states: `pending`, `completed`, and `deleted`. The application features user authentication, ensuring that each user can only manage their own tasks.

---

### ✨ Features

* **User Authentication**: Secure user sign-up and login.
* **Personalized Task Management**: Users can only view and manage their own tasks.
* **Task Creation**: Easily add new tasks.
* **Task Status Management**: Change task status to `completed` or `deleted`.
* **Task Restoration**: Restore `deleted` tasks back to `pending`.
* **Task Filtering**: Sort tasks by `all`, `pending`, `completed`, or `deleted` states.
* **Persistence**: All user and task data is stored in a MongoDB database.
* **Simple UI**: A clean and straightforward user interface.
* **API-driven**: Clear separation between frontend and backend logic.

---

### 🏗️ Architecture

This application follows a **Client-Server Architecture**:

* **Frontend (Client-Side)**:
    * HTML pages (`login.html`, `dashboard.html`) for structure.
    * Embedded CSS for styling.
    * Embedded JavaScript for user interaction and communication with the backend API using `fetch` requests.
    * Runs directly in the user's web browser.

* **Backend (Server-Side - Node.js API)**:
    * Built with **Node.js** and the **Express.js** framework.
    * Acts as a RESTful API.
    * Handles:
        * **Authentication**: User signup, login, password hashing (`bcrypt`), issuing JSON Web Tokens (JWT) for session management.
        * **Authorization**: Protecting API routes so only authenticated users can access their tasks.
        * **Task Management**: CRUD (Create, Read, Update) operations for tasks.
        * **Database Interaction**: Connects to and interacts with **MongoDB** using **Mongoose.js** (an Object Data Modeling library for MongoDB and Node.js).
        * **Error Handling & Logging**.

* **Database (MongoDB)**:
    * A NoSQL document database.
    * Stores `users` and `tasks` collections.
    * MongoDB is used for persistence.

---

### 🛠️ Technologies Used

* **Backend**:
    * **Node.js**: JavaScript runtime environment.
    * **Express.js**: Fast, unopinioned, minimalist web framework for Node.js.
    * **Mongoose**: MongoDB Object Data Modeling (ODM) for Node.js, simplifying interactions with MongoDB.
    * **JWT (JSON Web Tokens)**: For secure, stateless user authentication.
    * **Bcrypt.js**: For secure password hashing.
    * **Dotenv**: For managing environment variables.
    * **CORS**: Express middleware for Cross-Origin Resource Sharing.
    * **Winston**: A versatile logging library.
* **Frontend**:
    * **HTML5**: Structure of the web pages.
    * **CSS3**: Styling.
    * **JavaScript**: Client-side logic for dynamic UI and API communication.
* **Database**:
    * **MongoDB Atlas**: Cloud-hosted NoSQL database.

---

### 📂 Project Structure

```
├── .env                    # Environment variables (e.g., MongoDB URI, JWT Secret)
├── package.json            # Backend dependencies and scripts
├── server.js               # Main Express application, routes, and global error handling
├── db.js                   # MongoDB connection logic
├── models/                 # Mongoose schemas for MongoDB collections
│   ├── User.js             # User schema
│   └── Task.js             # Task schema
├── controllers/            # Business logic for API endpoints
│   ├── authController.js   # User signup and login logic
│   └── taskController.js   # Task CRUD operations
├── middleware/             # Express middleware
│   └── authMiddleware.js   # JWT authentication middleware
└── public/                     # Frontend HTML/CSS/JS files
    ├── login.html              # User login and signup interface
    └── dashboard.html          # Main Todo application interface
```

---

### 📊 ER Diagram

[**Link to ER Diagram**](https://lucid.app/lucidchart/4d5b049a-bab6-4deb-beb6-f0d7c1783a2c/edit?viewport_loc=-754%2C-1728%2C2186%2C1532%2C0_0&invitationId=inv_6808513c-3062-48a7-84b8-6db7dcde84e2)

*(This section will contain a link to the Entity-Relationship Diagram that visually represents the database schema. The diagram shows the `Users` and `Tasks` entities and their one-to-many relationship, with `user_id` as the foreign key in `Tasks` referencing `Users`.)*

---
