export const PostSchema = {
  id: 'string',
  title: 'string',
  content: 'string',
  excerpt: 'string',
  featuredImage: 'string',
  slug: 'string',
  author: {
    id: 'string',
    name: 'string',
    email: 'string',
    avatar: 'string',
    bio: 'string',
    role: 'string'
  },
  category: {
    id: 'string',
    name: 'string',
    slug: 'string',
    color: 'string',
    description: 'string'
  },
  tags: 'array',
  isPublished: 'boolean',
  viewCount: 'number',
  comments: 'array',
  createdAt: 'string',
  updatedAt: 'string'
};

export const CommentSchema = {
  id: 'string',
  user: {
    id: 'string',
    name: 'string',
    avatar: 'string'
  },
  content: 'string',
  createdAt: 'string'
};

export const CategorySchema = {
  id: 'string',
  name: 'string',
  slug: 'string',
  description: 'string',
  color: 'string',
  createdAt: 'string'
};

export const UserSchema = {
  id: 'string',
  name: 'string',
  email: 'string',
  avatar: 'string',
  bio: 'string',
  role: 'string'
};

// Helper function for type validation (optional)
export const validatePost = (post) => {
  const required = ['title', 'content', 'author', 'category'];
  return required.every(field => post[field]);
};

export const validateUser = (user) => {
  const required = ['name', 'email'];
  return required.every(field => user[field]);
};