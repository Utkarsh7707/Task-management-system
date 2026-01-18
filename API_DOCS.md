# TaskFlow API Documentation

**Base URL:** `http://localhost:5000/api`

## Authentication
Most endpoints are protected and require a valid JWT token.
**Header:** `Authorization: Bearer <your_token_here>`

---

## 1. Users & Authentication (`/auth`)

### **Register User**
Create a new user account.
* **Endpoint:** `POST /auth/register`
* **Access:** Public
* **Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
* **Response (201):**
    ```json
    {
      "_id": "64b5f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1..."
    }
    ```

### **Login User**
Authenticate a user and get a token.
* **Endpoint:** `POST /auth/login`
* **Access:** Public
* **Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
* **Response (200):** Same as Register.

### **Get Current Profile**
Get details of the currently logged-in user.
* **Endpoint:** `GET /auth/profile`
* **Access:** Private
* **Response (200):**
    ```json
    {
      "_id": "64b5f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
    ```

### **Get All Users**
Fetch a list of all users (id, name, email) for dropdown menus.
* **Endpoint:** `GET /auth/users`
* **Access:** Private
* **Response (200):**
    ```json
    [
      {
        "_id": "64b5f...",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      ...
    ]
    ```

---

## 2. Projects (`/projects`)

### **Get All Projects**
* **Endpoint:** `GET /projects`
* **Access:** Private
    * **Regular User:** Returns only projects created by the user.
    * **Admin:** Returns **ALL** projects in the database.
* **Response (200):**
    ```json
    [
      {
        "_id": "75c3d...",
        "title": "Website Redesign",
        "description": "Revamping the homepage...",
        "owner": { "name": "John Doe", "email": "..." },
        "createdAt": "2023-10-27T..."
      }
    ]
    ```

### **Create Project**
* **Endpoint:** `POST /projects`
* **Access:** Private
* **Body:**
    ```json
    {
      "title": "Mobile App V2",
      "description": "Development of the new iOS app."
    }
    ```
* **Response (201):** Returns created project object.

### **Get Project Stats**
Get counts for Total, Todo, In Progress, and Done tasks for a specific project.
* **Endpoint:** `GET /projects/:id/stats`
* **Access:** Private
* **Response (200):**
    ```json
    {
      "total": 12,
      "todo": 4,
      "inProgress": 3,
      "done": 5
    }
    ```

### **Delete Project**
* **Endpoint:** `DELETE /projects/:id`
* **Access:** Private
    * **Regular User:** Can only delete their own projects.
    * **Admin:** Can delete **ANY** project.
* **Response (200):**
    ```json
    { "message": "Project removed" }
    ```

---

## 3. Tasks (`/tasks`)

### **Get My Assigned Tasks**
Get all tasks assigned to the current user across all projects.
* **Endpoint:** `GET /tasks/my-tasks`
* **Access:** Private
* **Response (200):**
    ```json
    [
      {
        "_id": "98a2b...",
        "title": "Fix Navbar Bug",
        "status": "Todo",
        "priority": "High",
        "project": { "title": "Website Redesign" }
      }
    ]
    ```

### **Get Tasks by Project**
Get all tasks belonging to a specific project.
* **Endpoint:** `GET /tasks/:projectId`
* **Access:** Private
* **Response (200):** Array of task objects.

### **Create Task**
Add a new task to a project.
* **Endpoint:** `POST /tasks`
* **Access:** Private
* **Body:**
    ```json
    {
      "title": "Design Logo",
      "priority": "High",  // Enum: 'Low', 'Medium', 'High'
      "project": "64b5f...", // Project ID
      "assignedTo": "64c7d...", // User ID (Optional)
      "dueDate": "2023-12-31" // Optional
    }
    ```

### **Update Task**
Update task status or details.
* **Endpoint:** `PUT /tasks/:id`
* **Access:** Private
* **Body (Example - Moving to Done):**
    ```json
    {
      "status": "Done" // Enum: 'Todo', 'In Progress', 'Done'
    }
    ```
* **Response (200):** Returns updated task object.
