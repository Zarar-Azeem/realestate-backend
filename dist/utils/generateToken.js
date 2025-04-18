"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const generateTokenAndCookie = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, validateEnv_1.default.JWT_SECRET);
    const cookieOptions = { httpOnly: true };
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: false, // Disable in development
        sameSite: 'lax', // Helps with cross-origin cookie issues
    });
};
exports.generateTokenAndCookie = generateTokenAndCookie;
