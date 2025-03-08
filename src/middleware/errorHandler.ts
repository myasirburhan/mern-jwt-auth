import { ErrorRequestHandler } from 'express';
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_UNPROCESSABLE_ENTITY } from '../constants/http';
import { z } from 'zod';
import { Response } from 'express-serve-static-core';
import AppError from '../utils/AppError';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);

    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }

    if (error instanceof AppError) {
        return handleAppError(res, error);
    }

    res.status(HTTP_INTERNAL_SERVER_ERROR).send('Internal Server Error');
};

const handleZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map(err => {
        return {
            path: err.path.join('.'),
            message: err.message,
        };
    });

    res.status(HTTP_UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Validation Error',
        errors,
        errorCode: null,
        data: [],
    });
};

const handleAppError = (res: Response, error: AppError) => {
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: [],
        errorCode: error.errorCode,
        data: [],
    });
};

export default errorHandler;