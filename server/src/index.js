
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postsRouter from './routes/posts.js';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 4000;
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/posts', postsRouter);

app.use((err, _req, res, _next) => {
  // Surface errors in a consistent shape, avoiding leaks of internal details.
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({ message: err.message ?? 'Something went wrong.' });
});

async function start() {
  if (!mongoUri) {
    console.error('Missing MONGODB_URI environment variable.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Campus Lost & Found API listening on port ${port}`);
    });
  } catch (connectionError) {
    console.error('Failed to connect to MongoDB', connectionError);
    process.exit(1);
  }
}

start();

export default app;
