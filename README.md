# Project & Task Management Dashboard

A full-stack MERN application for managing projects and tasks with a drag-and-drop Kanban board.

## Features

**Authentication**: Secure user registration and login with JWT
 **Project Management**: Create, edit, and delete projects
 **Task Management**: Full CRUD operations for tasks within projects
 **Kanban Board**: Drag-and-drop task management
 **Search & Filter**: Search and filter projects/tasks
 **Pagination**: Paginated project listing
 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- @hello-pangea/dnd for drag-and-drop
- Axios for API calls
- React Toastify for notifications

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
```
** Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```
** if you don't have this module install this
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install -nodemon
```

Start MongoDB locally, then run:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
### Install Vite (if not installed)
If you don’t have Vite installed globally, run:
```bash
npm install -g vite
```
### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - Get all projects (with pagination, search, filter)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/projects/:projectId/tasks` - Get all tasks for a project
- `POST /api/projects/:projectId/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Project Structure

```
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & error middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # Auth context
│   │   ├── pages/      # Page components
│   │   └── services/   # API service
│   └── index.html
└── README.md
```

## Usage

1. Register a new account or login
2. Create a new project from the dashboard
3. Click on a project to view tasks
4. Add, edit, or delete tasks
5. Drag and drop tasks between columns on the Kanban board

## License

ManasviMoradiya@2026

