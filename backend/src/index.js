require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const main = require('./config/db');
const startUnverifiedUserCleanup = require('./services/jobs/unverifiedUserCleanup');

const authRouter = require('./routes/authRoutes');
const problemRouter = require('./routes/problemRoutes');
const submitRouter = require('./routes/submissionRoutes');
const videoRouter = require('./routes/videoRoutes');
const statsRoutes = require('./routes/statsRoutes');
const profileRouter = require('./routes/profileRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');
const { redisClient, connectRedis } = require('./config/redis');

const cors = require('cors');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '50mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CodeArena API Running',
  });
});

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/video', videoRouter);
app.use('/api/stats', statsRoutes);
app.use('/profile', profileRouter);

app.use(errorMiddleware);

process.on('SIGINT', async () => {
  try {
    await redisClient.quit();
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
});

const initialiseConnection = async () => {
  try {
    await Promise.all([main(), connectRedis()]);

    startUnverifiedUserCleanup();

    console.log('DB connected');

    app.listen(process.env.PORT, () => {
      console.log('Server is listening at port ' + process.env.PORT);
    });
  } catch (err) {
    console.error('Startup Error:', err);
  }
};

initialiseConnection();
