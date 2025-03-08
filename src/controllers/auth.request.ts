import { z } from "zod";

const emailRule = z.string().email().min(1).max(255);
const passwordRule = z.string().min(6).max(255);
const userAgentRule = z.string().optional();

export const loginRequest = z.object({
    email: emailRule,
    password: passwordRule,
    userAgent: userAgentRule,
});

export const registerCreateRequest = loginRequest.extend({
    confirmPassword: passwordRule,
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',  // custom error message if the condition is not met
    path: ['confirmPassword'],          // specify the path of the error
});

