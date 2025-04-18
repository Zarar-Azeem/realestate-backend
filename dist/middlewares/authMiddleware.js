"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnv_1 = __importDefault(require("../utils/validateEnv"));
const userModel_1 = __importDefault(require("../models/userModel"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("This ran");
    console.log(req.cookies.authToken);
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Not Authorized" });
    }
    console.log("This ran too");
    try {
        const data = jsonwebtoken_1.default.verify(token, validateEnv_1.default.JWT_SECRET);
        req.user = (yield userModel_1.default.findById(data.userId).select("-password"));
        console.log("This ran too00000000");
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.requireAuth = requireAuth;
