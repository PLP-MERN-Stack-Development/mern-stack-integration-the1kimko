# MERN Blog Platform

This repository contains a full-stack blog platform built with the MERN (MongoDB, Express, React, Node.js) stack. It supports public browsing and authenticated authoring of posts, user profiles, commenting, category management, and rich filtering delivered through a modern React UI powered by Vite and Tailwind CSS.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Database Seeding](#database-seeding)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [State Management](#state-management)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

**Frontend**
- React 19 with functional components and hooks
- React Router 7 for SPA navigation
- Zustand for global state management
- Tailwind CSS 3 and utility-first styling
- Vite 7 for development/build tooling

**Backend**
- Node.js 20+ with Express 5
- MongoDB with Mongoose ODM
- JWT authentication and bcrypt password hashing
- Helmet, CORS, and custom middleware for security

**Tooling & Utilities**
- ESLint (frontend) for linting
- Nodemon for backend hot-reload
- Faker.js for database seeding

---

## Key Features
- Public feed with pagination, search, tag/category filters, and featured media.
- JWT-protected author workflows: create, update, delete, and list personal posts.
- Category taxonomy with color-coded badges.
- Rich text storage (HTML strings) and excerpt support for previews.
- Commenting system with live post updates.
- Responsive UI with light/dark mode preference saved in local storage.
- Centralized API client that manages tokens, query parameters, and error handling.

---

## Project Structure

```txt
.
├── client/                # React frontend
│   ├── src/
│   │   ├── api/           # Fetch wrappers and API client
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level views
│   │   └── store/         # Zustand stores
│   └── vite.config.js
├── server/                # Express backend
│   ├── config/            # Database connection helper
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth utilities
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── seed.js            # Seed script (faker)
│   └── server.js          # App entry point
├── README.md
└── package-lock.json / package.json (per workspace)
```

---

## Prerequisites
- **Node.js** ≥ 20 (required by Vite 7 and modern tooling)
- **npm** ≥ 10 (bundled with Node 20)
- **MongoDB** ≥ 6 (local instance or Atlas cluster)
- Optional: **Git** for version control and deployment

---

## Environment Variables

Create `.env` files in the root of `server/` and `client/` before running the app.

**server/.env**

| Variable            | Description                                                   | Example                            |
|---------------------|---------------------------------------------------------------|------------------------------------|
| `PORT`              | API port (defaults to 5000)                                   | `5000`                             |
| `NODE_ENV`          | `development` or `production`                                 | `development`                      |
| `MONGODB_URI`       | MongoDB connection string                                     | `mongodb://127.0.0.1:27017/blog`   |
| `JWT_SECRET`        | Secret key for signing JWTs                                   | `super-secret-key`                 |
| `JWT_EXPIRES_IN`    | Token lifetime                                                | `7d`                               |
| `ALLOWED_ORIGIN1`   | Whitelisted CORS origin (frontend URL)                        | `http://localhost:5173`            |
| `ALLOWED_ORIGIN2`   | Optional second allowed origin                                | `https://yourdomain.com`           |
| `UPLOAD_PATH`       | Directory for uploaded assets                                 | `./uploads`                        |

**client/.env**

| Variable        | Description                              | Example                        |
|-----------------|------------------------------------------|--------------------------------|
| `VITE_API_URL`  | Base URL for the Express API              | `http://localhost:5000/api`    |
| `VITE_APP_NAME` | Optional display name used in the UI      | `MERN Blog`                    |

> The frontend API client automatically attaches the JWT stored in `localStorage` to authorized requests.

---

## Local Development

1. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. **Start MongoDB**
   ```bash
   mongod
   ```
3. **Run the backend**
   ```bash
   cd server
   npm run dev
   ```
   The API listens on `http://localhost:5000`.

4. **Run the frontend**
   ```bash
   cd client
   npm run dev
   ```
   Vite serves the SPA on `http://localhost:5173` by default.

Ensure the value of `ALLOWED_ORIGIN1` matches the Vite origin to avoid CORS errors during development.

---

## Database Seeding

The seed script populates sample categories and posts tied to an existing user.

```bash
cd server
node seed.js
```

> The script expects a user with the email `kim2@test.com`. Create one manually (via the API or MongoDB Compass) before running the seed command.

---

## Available Scripts

**Frontend (`client/`)**

| Command         | Purpose                               |
|-----------------|---------------------------------------|
| `npm run dev`   | Start Vite dev server with HMR        |
| `npm run build` | Production build to `client/dist`     |
| `npm run preview` | Preview the production build locally |
| `npm run lint`  | Run ESLint with the project config    |

**Backend (`server/`)**

| Command         | Purpose                                       |
|-----------------|-----------------------------------------------|
| `npm run dev`   | Start Express API with Nodemon                |
| `npm start`     | Start Express API in production mode          |
| `node seed.js`  | Seed categories and posts (requires user)     |

---

## API Overview

Base URL: `http://localhost:5000/api`

**Authentication**
- `POST /auth/register` — Register and receive a JWT.
- `POST /auth/login` — Authenticate a user.
- `GET /auth/me` — Fetch the current authenticated user.
- `PUT /auth/profile` — Update profile information.

**Posts**
- `GET /posts` — List posts with query params: `page`, `limit`, `category`, `search`, `published`.
- `GET /posts/:id` — Retrieve a post by Mongo ObjectId.
- `GET /posts/slug/:slug` — Retrieve a post by slug.
- `GET /posts/my` — Fetch posts authored by the current user.
- `POST /posts` — Create a new post (auth required).
- `PUT /posts/:id` — Update a post (author or admin only).
- `DELETE /posts/:id` — Delete a post (author or admin only).
- `POST /posts/:id/comments` — Add a comment (auth required).

**Categories**
- `GET /categories` — List all categories.
- `POST /categories` — Create a category (admin).
- `GET /categories/:id` — Retrieve a category.
- `PUT /categories/:id` — Update a category (admin).
- `DELETE /categories/:id` — Remove a category (admin).

---

## State Management

The frontend uses two Zustand stores:

1. **`useAuthStore`**
   - Manages `user`, `token`, loading states, and error handling.
   - Provides `login`, `register`, `logout`, `getMe`, `updateProfile`, and `isAuthenticated`.
   - Persists tokens to `localStorage` and configures the shared API client.

2. **`useBlogStore`**
   - Holds post lists, the current post, pagination metadata, and category data.
   - Implements `fetchPosts`, `fetchMyPosts`, `fetchPost`, `fetchPostBySlug`, `createPost`, `updatePost`, `deletePost`, `addComment`, and category helpers.
   - Normalizes UI filters (search, category, published) and merges them with API calls.

---

## Deployment Guide

1. **Prepare the backend environment**
   - Provision a MongoDB instance (Atlas or self-managed) and note the connection string.
   - Generate a strong `JWT_SECRET` and populate `server/.env` alongside `PORT`, `MONGODB_URI`, `JWT_EXPIRES_IN`, and `ALLOWED_ORIGIN*` values that point at your hosted frontend.
   - Decide whether Express will also serve the PWA bundles or if you will host the frontend separately.

2. **Build and host the frontend**
   ```bash
   cd client
   npm install
   npm run build
   ```
   - Deploy the generated `client/dist` directory to a static host (Netlify, Vercel, S3/CloudFront, etc.).
   - For a single deployable bundle, copy `client/dist` into the backend project and serve it via Express (see optional step below).

3. **Deploy the backend**
   - Copy the `server/` folder to your server or PaaS (Render, Railway, Fly.io, etc.).
   - Install production dependencies: `npm install --production`.
   - Configure environment variables through your host’s dashboard or `.env`.
   - Start the server with `npm start` and manage the process with `pm2`, systemd, or your host’s supervisor.

4. **Configure CORS**
   - Ensure the deployed frontend URL exactly matches one of the values in `allowedOrigins` derived from `ALLOWED_ORIGIN1` / `ALLOWED_ORIGIN2`. Any mismatch results in a browser CORS error.

5. **Optional: Serve the SPA from Express**
   - Move the contents of `client/dist` to a directory such as `server/public`.
   - Add to `server/server.js`:
     ```js
     app.use(express.static(path.join(__dirname, 'public')));
     app.get('*', (_, res) => {
       res.sendFile(path.join(__dirname, 'public', 'index.html'));
     });
     ```

6. **Seed production data (optional)**
   - Create an initial user manually or via `/api/auth/register`.
   - Update `server/seed.js` with the user’s email and run `node seed.js` to populate example posts and categories.


## Troubleshooting

- **CORS Errors** — Confirm that the frontend origin is included in `allowedOrigins` inside `server/server.js` via `ALLOWED_ORIGIN1/2`.
- **JWT Failures** — Ensure the `JWT_SECRET` matches between login and authenticated requests; a missing or expired token will trigger a 401.
- **Seed Script Errors** — Create the target user before running `node seed.js`. Update the script if you use a different email.
- **404/JSON Parse Errors** — The API client traps non-JSON responses, but inspect browser dev tools for the original status code when debugging.
- **Mongo Connection Issues** — Verify that `MONGODB_URI` points to a reachable database and that your IP is whitelisted if using Atlas.

---

Happy hacking! Feel free to extend the platform with rich text editing, image uploads, analytics dashboards.
