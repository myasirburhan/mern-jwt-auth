import assert from "node:assert";
import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";
import AppError from "./AppError";

type AppAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode,
) => asserts condition;

/**
 * assert condition and throw AppError if condition is false
 */
const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) => {
    assert(condition, new AppError(httpStatusCode, message, appErrorCode));
}

export default appAssert;