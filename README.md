# Node.js Blog API with Authentication

This project is a Node.js-based backend API for a blog application with user authentication, blog post management, and commenting features.

## Features

### User Authentication
- User registration
- User login
- JWT-based authentication

### Blog Post Management
- Create, Read, Update, and Delete (CRUD) operations for blog posts
- Posts include title, content, author, and timestamps

### Commenting System
- CRUD operations for comments
- Comments are linked to specific posts and include content, author, and timestamps

## Technologies Used

- Node.js
- Express.js for API routing
- Postgres for database
- Postgres for object modeling
- bcrypt for password hashing
- jsonwebtoken for JWT generation and verification

## Setup and Installation

1. Clone the repository:

2. Start the server:

## npm  run server

## API Endpoints

### Authentication
- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Login user

### Blog Posts
- GET `/api/posts`: Get all posts
- GET `/api/posts/:id`: Get a specific post
- POST `/api/posts`: Create a new post (requires authentication)
- PUT `/api/posts/:id`: Update a post (requires authentication)
- DELETE `/api/posts/:id`: Delete a post (requires authentication)

### Comments
- GET `/api/posts/:postId/comments`: Get all comments for a post
- POST `/api/posts/:postId/comments`: Add a comment to a post (requires authentication)
- PUT `/api/comments/:id`: Update a comment (requires authentication)
- DELETE `/api/comments/:id`: Delete a comment (requires authentication)

## Project Structure




## Database Models

### User
- username (String, required, unique)
- email (String, required, unique)
- password (String, required)

### Post
- title (String, required)
- content (String, required)
- author (ObjectId, ref: 'User')
- createdAt (Date)
- updatedAt (Date)

### Comment
- content (String, required)
- author (ObjectId, ref: 'User')
- post (ObjectId, ref: 'Post')
- createdAt (Date)
- updatedAt (Date)

## Authentication

- JWT (JSON Web Tokens) are used for authentication
- Tokens are sent in the `Authorization` header as `Bearer <token>`
- Protected routes require a valid JWT to access

## Error Handling

The API uses consistent error responses:
- 400 for bad requests
- 401 for unauthorized access
- 404 for not found resources
- 500 for server errors

## Data Validation

- Input data is validated using Mongoose schema validation
- Additional validation is performed in controllers where necessary

## Security Measures

- Passwords are hashed using bcrypt before storing
- JWT secrets are stored in environment variables
- MongoDB connection string is stored in environment variables

