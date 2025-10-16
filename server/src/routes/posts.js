import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB cap for inline images.

router.post('/', async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (typeof payload.contactInfo === 'string') {
      payload.contactInfo = payload.contactInfo.trim();
    }

    if (typeof payload.contactPhone === 'string') {
      payload.contactPhone = payload.contactPhone.trim();
      if (!payload.contactPhone) {
        delete payload.contactPhone;
      }
    }

    if (payload.image != null) {
      if (typeof payload.image !== 'string') {
        const error = new Error('Image must be a base64-encoded data URL.');
        error.statusCode = 400;
        throw error;
      }

      payload.image = payload.image.trim();

      if (!payload.image) {
        delete payload.image;
      } else {
        if (!payload.image.startsWith('data:image/')) {
          const error = new Error('Image must be a base64-encoded data URL.');
          error.statusCode = 400;
          throw error;
        }

        const [, base64] = payload.image.split(',');
        const imageBytes = base64 ? Buffer.from(base64, 'base64').length : 0;
        if (imageBytes > MAX_IMAGE_SIZE_BYTES) {
          const error = new Error('Image must be 2MB or smaller.');
          error.statusCode = 400;
          throw error;
        }
      }
    }

    const post = await Post.create(payload);
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
    const { status, includeInactive, q } = req.query;
    const query = {
      ...(status ? { status } : {}),
      ...(includeInactive === 'true' ? {} : { isActive: { $ne: false } })
    };
    if (q && typeof q === 'string' && q.trim()) {
      const escapedQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedQuery, 'i');
      query.$or = [
        { itemName: regex },
        { description: regex },
        { location: regex },
        { contactInfo: regex }
      ];
    }
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
