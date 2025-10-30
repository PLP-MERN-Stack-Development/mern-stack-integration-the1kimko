// server/routes/posts.js
const express = require('express');
const {
  getPosts,
  getPost,
  getPostBySlug,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
  addComment,
  uploadPostImage,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);

// PRIVATE: MY POSTS - BEFORE ID ROUTES
router.get('/my', protect, getMyPosts);

// PRIVATE: UPLOADS
router.post('/upload', protect, upload.single('image'), uploadPostImage);

// ID-BASED ROUTES
router.get('/:id', getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// OTHER PRIVATE ROUTES
router.post('/', protect, createPost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
