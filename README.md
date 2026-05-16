# Collaborative Notes App

A full-stack collaborative notes application where users can register, log in, create notes, edit notes, delete notes, share notes with registered users, pin important notes, lock private notes, search notes, and manage notes through a responsive frontend.

The project includes a deployed backend API, a responsive React frontend, PostgreSQL database integration, JWT authentication, Swagger/OpenAPI documentation, and additional note-management features.

---

## Live Links

**Frontend:**  
https://notes-app-mrigakshi.netlify.app

**Backend API Base URL:**  
https://notes-backend-shhe.onrender.com

**Swagger Documentation:**  
https://notes-backend-shhe.onrender.com/docs

**OpenAPI JSON:**  
https://notes-backend-shhe.onrender.com/openapi.json

**About Endpoint:**  
https://notes-backend-shhe.onrender.com/about

**GitHub Repository:**  
https://github.com/mrigakshi-chib/notes-app

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Swagger / OpenAPI

### Deployment

- Frontend: Netlify
- Backend: Render
- Database: Neon PostgreSQL

---

## Core Features

### User Registration

Users can create an account using email and password.

Passwords are hashed using bcrypt before being stored in the database.

```txt
POST /register
```

---

### User Login

Registered users can log in using email and password.

After successful login, a JWT token is returned and used to access protected routes.

```txt
POST /login
```

---

### JWT Authentication

Protected routes require a valid JWT token in the Authorization header.

```txt
Authorization: Bearer <token>
```

---

### Create Notes

Authenticated users can create notes with a title and content.

```txt
POST /notes
```

---

### View Notes

Authenticated users can view their own notes and notes shared with them.

```txt
GET /notes
```

---

### View Specific Note

Authenticated users can view a specific note by ID.

Users can access a note only if they own it or if it has been shared with them.

```txt
GET /notes/:id
```

---

### Update Notes

Users can update only the notes they own.

Shared notes are view-only for the receiving user.

```txt
PUT /notes/:id
```

---

### Delete Notes

Users can delete only the notes they own.

```txt
DELETE /notes/:id
```

---

### Share Notes

Users can share their own notes with another user.

A note can be shared only with a user who is already registered in the application.

Shared notes appear in the receiver's dashboard under the **Shared With Me** section.

```txt
POST /notes/:id/share
```

Expected request body:

```json
{
  "share_with_email": "friend@example.com"
}
```

---

### API Documentation

The backend provides OpenAPI documentation.

```txt
GET /openapi.json
```

Swagger UI is available at:

```txt
GET /docs
```

---

### About Endpoint

The `/about` endpoint returns developer details and implemented features.

```txt
GET /about
```

---

## Extra Features Added

Apart from the required assignment features, I added the following meaningful features:

### 1. Pinned Notes

Users can pin important notes for quick access.

Pinned notes appear above regular notes.

Only the owner of a note can pin or unpin it.

```txt
PATCH /notes/:id/pin
```

Why I added it:

Pinning improves note organization and helps users quickly access important notes.

---

### 2. Locked Notes

Users can lock their own notes using a PIN.

When a note is locked, its content is hidden.

The lock PIN is hashed using bcrypt before being stored in the database.

Only the note owner can lock or unlock a note.

```txt
PATCH /notes/:id/lock
```

Why I added it:

Locking notes adds a privacy layer and demonstrates secure handling of sensitive data.

---

### 3. Separate Shared Notes Section

The dashboard separates notes into:

- My Notes
- Shared With Me

Why I added it:

This makes ownership clear and improves the user experience.

---

### 4. View-Only Shared Notes

Shared notes are view-only for the receiving user.

The receiver cannot edit, delete, lock, pin, or re-share a note they do not own.

Why I added it:

This keeps ownership permissions safe and logical.

---

### 5. Dark Mode

The dashboard includes a dark mode toggle.

Why I added it:

Dark mode improves user experience and gives users control over the app's appearance.

---

### 6. Responsive UI

The frontend is responsive and works on both desktop and mobile devices.

Why I added it:

A responsive layout makes the app easier to use across different screen sizes.

---

## Optional / Stretch Features Completed

The assignment mentioned optional stretch goals. I completed the following:

### 1. Basic Frontend

A complete frontend was built using React, TypeScript, Vite, Tailwind CSS, Axios, and React Router DOM.

The frontend includes:

- Register page
- Login page
- Dashboard page
- Create note
- Edit note
- Delete note
- Share note
- Pin note
- Lock note
- Search notes
- My Notes section
- Shared With Me section
- Dark mode
- Responsive layout

Live frontend:

```txt
https://notes-app-mrigakshi.netlify.app
```

---

### 2. Search Notes

Search functionality was implemented.

Users can search notes by title or content.

Backend endpoint:

```txt
GET /search?q=keyword
```

The frontend also includes a search bar for filtering visible notes.

---

### 3. Pagination

Pagination support was implemented in the backend notes API.

Example:

```txt
GET /notes?page=1&limit=5
```

Pagination improves scalability by limiting the number of notes returned in a single response.

---

### 4. Swagger / OpenAPI Documentation

Swagger/OpenAPI documentation was added for the backend API.

Swagger UI:

```txt
https://notes-backend-shhe.onrender.com/docs
```

OpenAPI JSON:

```txt
https://notes-backend-shhe.onrender.com/openapi.json
```

---

### 5. Deployment

The complete application was deployed.

- Frontend deployed on Netlify
- Backend deployed on Render
- Database hosted on Neon PostgreSQL

---

## API Endpoints

### Public Routes

| Method |   Endpoint      | Description                               |
|  ---   |     ---         |    ---                                    |
| POST   | `/register`     | Register a new user                       |
| POST   | `/login`        | Log in and receive JWT token              |
| GET    | `/about`        | Returns developer and feature information |
| GET    | `/openapi.json` | Returns OpenAPI JSON                      |
| GET    | `/docs`         | Swagger API documentation                 |

---

### Protected Routes

Protected routes require a JWT token.

```txt
Authorization: Bearer <token>
```

| Method | Endpoint           | Description                               |
|---     |---                 |---                                        |
| GET    | `/notes`           | Get user's own notes and shared notes     |
| GET    | `/notes/:id`       | Get a specific note by ID                 |
| POST   | `/notes`           | Create a new note                         |
| PUT    | `/notes/:id`       | Update a note owned by the user           |
| DELETE | `/notes/:id`       | Delete a note owned by the user           |
| POST   | `/notes/:id/share` | Share a note with another registered user |
| PATCH  | `/notes/:id/pin`   | Pin or unpin a note owned by the user     |
| PATCH  | `/notes/:id/lock`  | Lock or unlock a note owned by the user   |
| GET    | `/search?q=keyword`| Search notes by title or content          |

---

## Example API Requests

### Register

```http
POST /register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### Login

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "access_token": "jwt_token_here"
}
```

---

### Create Note

```http
POST /notes
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "title": "My Note",
  "content": "This is my note content."
}
```

---

### Get Notes with Pagination

```http
GET /notes?page=1&limit=5
Authorization: Bearer <token>
```

---

### Get Specific Note

```http
GET /notes/:id
Authorization: Bearer <token>
```

---

### Share Note

```http
POST /notes/:id/share
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "share_with_email": "friend@example.com"
}
```

Note: The receiver must already be registered in the application.

---

### Lock Note

```http
PATCH /notes/:id/lock
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "pin": "1234"
}
```

---

### Search Notes

```http
GET /search?q=meeting
Authorization: Bearer <token>
```

---

## Environment Variables

### Backend

Create a `.env` file inside the `notes-backend` folder.

```env
DATABASE_URL="your_neon_postgresql_database_url"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

---

### Frontend

Create a `.env` file inside the `notes-frontend` folder.

For local development:

```env
VITE_API_URL=http://localhost:5000
```

For deployed frontend:

```env
VITE_API_URL=https://notes-backend-shhe.onrender.com
```

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mrigakshi-chib/notes-app.git
cd notes-app
```

---

### 2. Backend Setup

```bash
cd notes-backend
npm install
```

Create a `.env` file inside `notes-backend` and add the backend environment variables.

Push Prisma schema to the database:

```bash
npx prisma db push
```

Generate Prisma client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

### 3. Frontend Setup

Open another terminal from the root folder.

```bash
cd notes-frontend
npm install
```

Create a `.env` file inside `notes-frontend` and add:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Project Structure

```txt
notes-app/
├── notes-backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── notes-frontend/
│   ├── public/
│   │   └── _redirects
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

---

## Database Models

### User

Stores registered users.

Main fields:

- id
- email
- password
- createdAt

### Note

Stores notes created by users.

Main fields:

- id
- title
- content
- isPinned
- isLocked
- lockPin
- ownerId
- createdAt
- updatedAt

### SharedNote

Stores the relationship between shared notes and users.

Main fields:

- id
- noteId
- userId

---

## Security Decisions

- Passwords are hashed using bcrypt.
- Lock PINs are hashed using bcrypt.
- JWT is used for authentication.
- Protected routes require a valid token.
- Users can only edit, delete, pin, lock, and share notes they own.
- Shared notes are view-only for receiving users.
- Notes can be shared only with already registered users.
- Backend authorization prevents users from modifying notes they do not own.
- Frontend hides owner-only controls for shared notes.

---

## Deployment Notes

The backend is deployed on Render free tier.

Because of this, the first request after inactivity may take a few seconds due to cold start.

The frontend is deployed on Netlify.

The database is hosted on Neon PostgreSQL.

For React Router support on Netlify, a `_redirects` file is added inside the frontend `public` folder:

```txt
/*    /index.html   200
```

This prevents page-not-found errors when refreshing frontend routes like `/dashboard`.

---

## Testing the App

To test the deployed application:

1. Open the frontend link.
2. Register a new account.
3. Log in.
4. Create a note.
5. Pin the note.
6. Lock and unlock the note using a PIN.
7. Register another user.
8. Share a note with the second registered user.
9. Log in as the second user.
10. Check the shared note under **Shared With Me**.
11. Use the search bar to search notes.
12. Test pagination through the backend endpoint.
13. Refresh `/dashboard` to verify routing works.

---

## Author

Mrigakshi Chib

Email: mrigakshichib@gmail.com