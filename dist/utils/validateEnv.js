"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_1 = require("envalid/dist/validators");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    DATABASE_URL: (0, validators_1.str)(),
    PORT: (0, validators_1.port)(),
    JWT_SECRET: (0, validators_1.str)(),
    CLIENT_URL: (0, validators_1.str)(),
    CLOUDINARY_CLOUD_NAME: (0, validators_1.str)(),
    CLOUDINARY_API_KEY: (0, validators_1.str)(),
    CLOUDINARY_API_SECRET: (0, validators_1.str)(),
});
