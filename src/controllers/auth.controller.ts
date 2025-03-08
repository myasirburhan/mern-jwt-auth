import catchError from "../utils/catchError";
import { createAccount, loginAccount } from "../services/auth.service";
import { setAuthCookies } from "../utils/cookies";
import { HTTP_CREATED, HTTP_OK } from "../constants/http";
import { loginRequest, registerCreateRequest } from "./auth.request";
import { verifyToken } from "../utils/jwt";

// export const registerController = catchError(async (req, res, next) => {
export const registerHandler = catchError(async (req, res) => {
    // validate request
    const request = registerCreateRequest.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    // call service
    const { user, accessToken, refreshToken } = await createAccount(request);

    // return response
    return setAuthCookies({ res, accessToken, refreshToken })
        .status(HTTP_CREATED)
        .json({
            success: true,
            message: 'Account created successfully',
            data: user,
            errors: [],
        });
});

export const loginHandler = catchError(async (req, res) => {
    // validate request
    const request = loginRequest.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    // call service
    const { accessToken, refreshToken } = await loginAccount(request);

    // return response
    return setAuthCookies({ res, accessToken, refreshToken })
        .status(HTTP_OK)
        .json({
            success: true,
            message: 'Login successfully',
            data: [],
            errors: [],
        });
});

export const logoutHandler = catchError(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    const { payload } = verifyToken(accessToken);

    // clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // return response
    return res.status(HTTP_OK).json({
        success: true,
        message: 'Logout successfully',
        data: [],
        errors: [],
    });
});