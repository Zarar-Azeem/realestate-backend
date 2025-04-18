"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: Number, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    savedProperties: [
        String
    ]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("user", userSchema);
