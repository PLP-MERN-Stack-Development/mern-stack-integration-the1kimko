// server/controllers/postController.js
const Post = require('../models/Post');
const Category = require('../models/Category');
// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, published } = req.query;

    // Build query
    const query = {};

    if (published !== undefined) {
      query.published = published === 'true';
    } else {
      query.published = true;  // Default to published posts
    }

    // Convert category slug to ObjectId
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (!cat) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
      query.category = cat._id;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate('category', 'name slug color')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.incrementViewCount();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get my posts
// @route   GET /api/posts/my
// @access  Private
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get post by slug
// @route   GET /api/posts/slug/:slug
// @access  Public
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name email avatar bio')
      .populate('category', 'name slug color')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.incrementViewCount();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, published } = req.body;

    // Handle tags
    let tagsArray = [];
    if (tags) {
      if (Array.isArray(tags)) {
        tagsArray = tags;
      } else if (typeof tags === 'string') {
        tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags: tagsArray,
      published: published ?? false,
      author: req.user.id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color');

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this post',
      });
    }

    const { title, content, excerpt, category, tags, published } = req.body;

    let tagsArray = post.tags;
    if (tags) {
      tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        excerpt,
        category,
        tags: tagsArray,
        published: published !== undefined ? published : post.published,
      },
      { new: true, runValidators: true }
    )
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color');

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required',
      });
    }

    await post.addComment(req.user.id, content);

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color')
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Upload featured image for a post
// @route   POST /api/posts/upload
// @access  Private
exports.uploadPostImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Image file is required',
    });
  }

  const filePath = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: {
      url: filePath,
      filename: req.file.filename,
    },
  });
};
