import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {
  ensureAnonymousCsrfId,
  generateCsrfToken,
} from './middleware/csrfProtection';

import userRoutes from './routes/userRoutes';
import loginRoutes from './routes/loginRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
app.set('trust proxy', '172.18.0.5');

app.use(helmet());

const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error('FRONTEND_URL environment variable is required');
}

app.use(
  cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/csrf-token', ensureAnonymousCsrfId, (req, res) => {
  const csrfToken = generateCsrfToken(req, res);

  res.status(200).json({ csrfToken });
});


app.use((req, res, next) => {
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!stateChangingMethods.includes(req.method)) {
    next();
    return;
  }

  const origin = req.get('origin');

  // Reject state-changing requests when Origin is missing.
if (!origin) {
  res.status(403).json({
    message: 'Request origin is required.',
  });
  return;
}

  try {
    const expectedOrigin = process.env.FRONTEND_URL;

    if (
      !expectedOrigin ||
      new URL(origin).origin !== new URL(expectedOrigin).origin
    ) {
      res.status(403).json({
        message: 'Request origin is not allowed.',
      });
      return;
    }
  } catch {
    res.status(403).json({
      message: 'Invalid request origin.',
    });
    return;
  }

  next();
});



// Serve uploaded images
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads')),
);

// Login routes
app.use('/api/login', loginRoutes);

// User routes
app.use('/api/users', userRoutes);


// Error handling middleware
app.use(errorHandler);

export default app;