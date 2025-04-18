"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var cors = require('cors');
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const errorHandler_1 = require("./utils/errorHandler");
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use('/api/property', propertyRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/message', messageRoutes_1.default);
app.use(errorHandler_1.pageNotFoundHandler);
app.use(errorHandler_1.errorHandler);
const port = validateEnv_1.default.PORT;
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
