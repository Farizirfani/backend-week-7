import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import userRouter from './routes/userRoute.js';
import generalRoute from './routes/generalRoute.js';
import gameRoute from './routes/GameRoute.js';
import errorHandler from './error/errorHandlingGlobal.js';
import notFoundHandler from './error/errorNotFound.js';

const app = express();
const port = process.env.PORT || 5000;

configDotenv();

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', gameRoute);
app.use('/user', userRouter);
app.use('/', generalRoute);

//error
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}...`));
