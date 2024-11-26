# Backend Setup

This is a RESTful API for managing users, roles, and blogs.

API DOCUMENTATION : https://sunny-september-5c1.notion.site/API-Documentation-14a72e56834880fa8c68f26c6dcda3ec

---

## Features

- **User Management**
  - Create a new user.
  - Login and logout users.
  - Fetch all users.
  - Assign or remove roles (Admin).
  - Ban or unban users.

- **Blog Management**
  - Add a new blog.
  - Delete a blog with RBAC (only Admin, Moderator, or the blog owner).
  - Fetch all blogs.

- **Audit Logs**
  - Fetch all audit logs for activity tracking.

- **Security Features**
  - JWT-based authentication.
  - Cookies for session management.
  - Rate limiting to prevent abuse.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Bhargav16exd/log
   ```
   
2. Navigate to the project directory:

   ```bash
     cd log
   ```
   
3. Install dependencies:

   ```bash
   npm install
   ```
 4. Create a `.env` file and configure the following environment variables:

   ```bash
   MONGO_DB_URL=somemongoURL
DB_NAME=somedbname
PORT=someport

JWT_SECRET=secretblahblah
CLIENT_URL=URL of frontend
   ```
 5. Run Dev Environment:

   ```bash
   npm run dev
   ```