const express = require('express');
const {
  getPosts,
  getPost,
  getMyPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  addComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/my')
  .get(protect, getMyPosts)

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/slug/:slug')
  .get(getPostBySlug);

router.route('/:id/comments')
  .post(protect, addComment);

module.exports = router;