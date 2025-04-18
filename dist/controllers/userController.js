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
exports.uploadAvatar = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAuthUser = exports.logOutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = require("../utils/generateToken");
const cloudinary_1 = require("../utils/cloudinary");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        let success = false;
        if (!name || !email || !password) {
            return res.status(401).json({ success, message: "Please enter all fields" });
        }
        let user = yield userModel_1.default.findOne({ email });
        if (user) {
            return res.status(401).json({ success, message: "Email is already taken" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const secpass = yield bcrypt_1.default.hash(password, salt);
        user = yield userModel_1.default.create({
            name,
            email,
            password: secpass
        });
        success = true;
        (0, generateToken_1.generateTokenAndCookie)(res, user._id);
        res.status(201).json({ success,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            } });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        console.log("Iam here");
        let success = false;
        if (!email || !password) {
            return res.status(401).json({ success, message: "Please enter all fields" });
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ success, message: "Enter correct credentials" });
        }
        const passCheck = yield bcrypt_1.default.compare(password, user.password);
        if (!passCheck) {
            return res.status(401).json({ success, message: "Enter correct credentials" });
        }
        console.log("Iam here2");
        success = true;
        const token = (0, generateToken_1.generateTokenAndCookie)(res, user._id);
        console.log();
        res.status(201).json({ success, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user === null || user === void 0 ? void 0 : user.number,
                avatar: user === null || user === void 0 ? void 0 : user.avatar
            } });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
const logOutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('authToken', '', { maxAge: 0, httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.logOutUser = logOutUser;
const getAuthUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.user.id);
        console.log(user);
        res.status(201).send({
            id: user === null || user === void 0 ? void 0 : user._id,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            number: user === null || user === void 0 ? void 0 : user.number,
            avatar: user === null || user === void 0 ? void 0 : user.avatar
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthUser = getAuthUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield userModel_1.default.findById(id);
        res.status(201).send({
            id: user === null || user === void 0 ? void 0 : user._id,
            name: user === null || user === void 0 ? void 0 : user.name,
            email: user === null || user === void 0 ? void 0 : user.email,
            number: user === null || user === void 0 ? void 0 : user.number,
            avatar: user === null || user === void 0 ? void 0 : user.avatar
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, number, password } = req.body;
    const avatarLocalPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    console.log(req.file);
    console.log(avatarLocalPath);
    try {
        let user = yield userModel_1.default.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        let newName = yield userModel_1.default.findOne({ name });
        if (newName) {
            if (user.name === name) {
                user.name = name;
            }
            else {
                return res.status(400).json({ message: "Name is already taken" });
            }
        }
        let newEmail = yield userModel_1.default.findOne({ email });
        if (newEmail) {
            if (user.email === email) {
                user.email = email;
            }
            else {
                return res.status(400).json({ message: "Email is already taken" });
            }
        }
        if (password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const secpass = yield bcrypt_1.default.hash(password, salt);
            user.password = secpass || user.password;
        }
        const upload = yield (0, cloudinary_1.uploadOnCloudinary)(avatarLocalPath);
        user.name = name || user.name;
        user.email = email || user.email;
        user.number = number || user.number;
        user.avatar = (upload === null || upload === void 0 ? void 0 : upload.secure_url) || user.avatar;
        yield user.save();
        res.status(201).json({ success: true, message: "User updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndDelete(req.user.id);
        res.status(201).send({
            message: "User deleted successfully",
            user: {
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
                number: user === null || user === void 0 ? void 0 : user.number,
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
const uploadAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const avatarLocalPath = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
    console.log((_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
    console.log(req.files);
});
exports.uploadAvatar = uploadAvatar;
