import AppErrorCode from "../constants/appErrorCode";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { HTTP_CONFLICT, HTTP_UNAUTHORIZED } from "../constants/http";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { oneYearFromNow } from "../utils/date";
import jsonwebtoken from "jsonwebtoken";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
    // verify existing account
    const existingUser = await UserModel.findOne({ email: data.email });
    // if (existingUser) {
    //     throw new Error('Account already exists');
    // }

    /*
    assert condition and throw AppError if condition is false
    jadi jika kondisi false, akan dihandle ini
    contoh kondisi !existingUser
    berarti jika false (alias existingUser ada), maka akan dihandle oleh appAssert
    */
    appAssert(!existingUser, HTTP_CONFLICT, 'Account already exists');

    // create user
    const user = await UserModel.create({
        email: data.email,
        password: data.password,
    });
    const userId = user._id;

    // create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId,
        type: VerificationCodeType.EmailVerification,
        expiredAt: oneYearFromNow(),
    });

    // send verification email
    // TODO:

    // create session
    const session = await SessionModel.create({
        userId,
        userAgent: data.userAgent,
    });


    // sign access token and refresh token
    const accessToken = signToken(
        {
            userId,
            sessionId: session._id,
        },
    );
    const refreshToken = signToken(
        {
            sessionId: session._id

        },
        refreshTokenSignOptions
    );

    // return user & token
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};

type LoginAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
};
export const loginAccount = async ({ email, password, userAgent }: LoginAccountParams) => {
    // get user by email
    const user = await UserModel.findOne({ email });
    appAssert(user, HTTP_UNAUTHORIZED, 'Invalid email or password');

    // validate password    
    const isValidPassword = await user.comparePassword(password);
    appAssert(isValidPassword, HTTP_UNAUTHORIZED, 'Invalid email or password');

    const userId = user._id;

    // create session
    const session = await SessionModel.create({
        userId,
        userAgent,
    });
    const sessionInfo = {
        sessionId: session._id,
    };

    // sign access token and refresh token
    const accessToken = signToken({
        ...sessionInfo,
        userId: user._id,
    });
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

    // return user & token
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};