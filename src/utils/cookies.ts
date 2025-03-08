import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = process.env.NODE_ENV !== 'development'; // false jika development

const defaults: CookieOptions = {
    sameSite: 'strict',
    httpOnly: true,
    secure,
};

const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow(),
});
/*
const getAccessTokenCookieOptions = (): CookieOptions => {
    return {
        ...defaults,
        expires: 15 * 60 * 1000, // 15 minutes
    };
};
*/

const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: '/auth/refresh',
});

type Params = {
    res: Response;
    accessToken: string;
    refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
    return res
        .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
        .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
};