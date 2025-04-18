"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageNotFoundHandler = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    let errorMessage = "An Unknown error occured";
    if (error instanceof Error)
        errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
    next();
};
exports.errorHandler = errorHandler;
const pageNotFoundHandler = (req, res, next) => {
    next(Error("Not Found"));
};
exports.pageNotFoundHandler = pageNotFoundHandler;
