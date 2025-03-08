import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectToDatabase from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import catchError from './utils/catchError';
import { HTTP_OK } from './constants/http';
import authRoutes from './routes/auth.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);
app.use(cookieParser());

/*
// app.get(
//     '/',
//     catchError(async (req, res, next) => {
//         throw new Error('ini error');
//         return res.status(HTTP_OK).json({
//             success: true,
//             message: 'Hello World',
//             data: []
//         });
//     }),
// );
*/

/* routing default */
// app.get('/', (req, res, next) => {
app.get('/', (_, res) => {
    res.status(HTTP_OK).json({
        success: true,
        message: 'Hello World',
        data: [],
    });
});

/* AUTH routing */
app.use('/auth', authRoutes);


/* Middleware, after controller & service */
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} environment`);
    await connectToDatabase();
});