import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import AuthRouter from './Routes/AuthRoute.js';
import UserRouter from './Routes/UserRoute.js';
import ProductRouter from './Routes/ProductRoute.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Routers
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/product', ProductRouter);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// MONGO DB CONNECTION
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection failed', err));

// Error Handling Middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  const errorStack = err.stack || "Internal Server Error";

  res.status(status).json({
    success: false,
    status,
    error: errorMessage,
    stack: errorStack
  });
});

app.listen(8800, () => {
  console.log('API is working on port 8800');
});
