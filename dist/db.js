"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const mongoUri = validateEnv_1.default.DATABASE_URL;
const connectToMongoose = () => {
    mongoose_1.default.connect(mongoUri)
        .then(() => console.log("Connected to Database"))
        .catch(() => console.log("Error Occurred while connecting to databse"));
};
exports.default = connectToMongoose;
