import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { status, includeInactive } = req.query;
    const query = {
      ...(status ? { status } : {}),
      ...(includeInactive === 'true' ? {} : { isActive: { $ne: false } })
    };
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
  } catch (error) {
    // Mongoose casts invalid IDs and throws a CastError; convert it into a 400.
    if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid post ID.';
    }
    next(error);
  }
});

router.patch('/:id/unlist', async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.json(post);
  } catch (error) {
    if (error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'Invalid post ID.';
    }
    next(error);
  }
});

export default router;
