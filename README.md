# MERN Blog Application - Development Guide

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) blog application with comprehensive features including user authentication, post management, comments, and advanced filtering.

## Project Overview

**Project Type**: Full-Stack MERN Application
**Frontend**: React + JavaScript + Vite + Tailwind CSS v4
**Backend**: Node.js + Express.js + MongoDB + Mongoose
**Authentication**: JWT-based with bcrypt password hashing
**State Management**: Zustand for frontend state

## Development Commands

### Frontend (client Directory)
```bash
npm install              # Install frontend dependencies
npm run dev              # Start development server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint              # Run ESLint for code quality
```

### Backend (server/ Directory)
```bash
cd server
npm install              # Install backend dependencies
npm run dev              # Start development server with nodemon (port 5000)
npm start                 # Start production server
```

### Database Setup
```bash
mongod                    # Start MongoDB server
```

## Architecture Overview

### Frontend Architecture
- **Component-Based**: Modular React components with JavaScript ES6+ syntax
- **State Management**: Zustand stores for authentication and blog data
- **API Layer**: Centralized API client with error handling and token management
- **Routing**: React Router for SPA navigation
- **Styling**: Tailwind CSS v4 with responsive design and modern utilities

### Backend Architecture
- **MVC Pattern**: Controllers, Models, Routes separation
- **RESTful API**: Standard REST endpoints with proper HTTP methods
- **Database**: MongoDB with Mongoose ODM for schema validation
- **Authentication**: JWT tokens with secure password hashing
- **Middleware**: CORS, helmet, morgan for security and logging

### Key Integrations
- **Frontend-Backend Communication**: Custom API client with automatic token injection
- **Database Relationships**: Posts ↔ Users, Posts ↔ Categories, Posts ↔ Comments
- **File Handling**: Multer for image uploads (uploads directory)
- **Environment Management**: Separate .env files for frontend and backend

## Database Schema

### User Model
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, email validation),
  password: String (required, hashed, min 6 chars),
  avatar: String (optional),
  bio: String (optional, max 500 chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  timestamps: true
}
```

### Post Model
```javascript
{
  title: String (required, max 100 chars),
  content: String (required),
  excerpt: String (optional, max 200 chars),
  slug: String (required, unique, auto-generated),
  featuredImage: String (default: 'default-post.jpg'),
  author: ObjectId (ref: 'User', required),
  category: ObjectId (ref: 'Category', required),
  tags: [String],
  isPublished: Boolean (default: false),
  viewCount: Number (default: 0),
  comments: [{
    user: ObjectId (ref: 'User'),
    content: String (required),
    createdAt: Date (default: Date.now)
  }],
  timestamps: true
}
```

### Category Model
```javascript
{
  name: String (required, max 50 chars),
  slug: String (required, unique, auto-generated),
  description: String (optional, max 200 chars),
  color: String (default: '#3B82F6', hex color validation),
  timestamps: true
}
```

## API Endpoints Structure

### Authentication (/api/auth)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile

### Posts (/api/posts)
- `GET /` - Get posts with pagination, search, and filtering
- `GET /:id` - Get single post by ID
- `GET /slug/:slug` - Get post by slug
- `POST /` - Create new post (authenticated)
- `PUT /:id` - Update post (author/admin only)
- `DELETE /:id` - Delete post (author/admin only)
- `POST /:id/comments` - Add comment to post (authenticated)

### Categories (/api/categories)
- `GET /` - Get all categories
- `GET /:id` - Get single category
- `POST /` - Create category (admin only)
- `PUT /:id` - Update category (admin only)
- `DELETE /:id` - Delete category (admin only)

## State Management Pattern

### Auth Store (useAuthStore)
```javascript
{
  user: User | null,
  token: string | null,
  isLoading: boolean,
  error: string | null,
  login(credentials),
  register(userData),
  logout(),
  getMe(),
  updateProfile(profileData),
  clearError(),
  isAuthenticated()
}
```

### Blog Store (useBlogStore)
```javascript
{
  posts: Post[],
  currentPost: Post | null,
  categories: Category[],
  postsLoading: boolean,
  postsError: string | null,
  pagination: { page, limit, total, pages },
  filters: { category, search, published },
  fetchPosts(params),
  fetchPost(id),
  createPost(postData),
  updatePost(id, postData),
  deletePost(id),
  addComment(postId, content),
  fetchCategories(),
  setFilters(filters),
  clearFilters()
}
```

## Environment Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MERN Blog
VITE_APP_VERSION=1.0.0
```

### Backend (server/.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:*****/mern-blog
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
```

## Key Features Implementation

### Authentication Flow
1. User registers/logs in → JWT token generated
2. Token stored in localStorage and API client
3. Token sent in Authorization header for protected routes
4. Backend validates token and attaches user to request

### Post Management
1. Create posts with rich content, categories, and tags
2. Automatic slug generation from title
3. Draft/published status control
4. Author-based edit/delete permissions
5. View count tracking on post access

### Search & Filtering
1. Text search across title, content, excerpt, and tags
2. Category-based filtering with color coding
3. Pagination for large result sets
4. URL-based filter state management

### Comments System
1. Nested comments with user information
2. Real-time comment addition
3. User avatar display
4. Timestamp formatting

## Development Workflow

### Adding New Features
1. **Backend**: Create model → controller → route → test
2. **Frontend**: Create component → add to store → add routing
3. **Integration**: Update API client → add error handling
4. **Testing**: Test frontend-backend integration

### Code Organization
- **Components**: Reusable UI components in `/src/components`
- **Pages**: Route-level components in `/src/pages`
- **API**: Service layer in `/src/api` with error handling
- **Store**: Zustand stores in `/src/store` for state management
- **Types**: JavaScript type definitions in `/src/types`

## Security Considerations

### Authentication Security
- Password hashing with bcryptjs (salt rounds: 10)
- JWT tokens with expiration (7 days default)
- Protected routes with middleware
- Input validation and sanitization

### API Security
- CORS configuration for frontend domain
- Helmet.js for security headers
- Request size limiting
- SQL injection prevention through Mongoose

### Data Validation
- Mongoose schema validation
- Frontend form validation
- Email format validation
- Password strength requirements

## Performance Optimizations

### Frontend
- Component lazy loading with React.lazy
- Optimistic UI updates for better UX
- Image lazy loading
- Debounced search functionality

### Backend
- Database indexing on frequently queried fields
- Pagination to limit data transfer
- Efficient Mongoose queries with population
- Static file serving for uploads

## Common Development Patterns

### Error Handling
- Centralized error handling in API client
- User-friendly error messages
- Consistent error response format
- Loading states for async operations

### State Updates
- Immutable state updates with Zustand
- Optimistic updates for better UX
- Cache invalidation on data changes
- Real-time state synchronization

## Tailwind CSS v4 Features

### Modern Utilities
- **Container Queries**: `@container` for responsive design
- **Modern Spacing**: `space-y-*`, `gap-*` utilities
- **Enhanced Grid**: `grid-cols-*` with responsive breakpoints
- **Advanced Typography**: `text-*` utilities for better control
- **Animation**: `transition-*` utilities for smooth interactions
- **Dark Mode Support**: Ready for dark/light theme implementation

### Component Styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Variants**: Consistent styling patterns across components
- **Hover States**: Interactive feedback with `hover:*` utilities
- **Focus States**: Accessibility with `focus:*` utilities
- **Loading States**: Consistent loading patterns throughout app
