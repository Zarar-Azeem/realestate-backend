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
exports.getMessagedUsers = exports.getMessages = exports.sendMessage = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { input, id: receiverId } = req.body;
    const senderId = req.user.id;
    try {
        let chat = yield chatModel_1.default.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!chat) {
            chat = yield chatModel_1.default.create({
                participants: [senderId, receiverId]
            });
        }
        const newMessage = yield messageModel_1.default.create({
            message: input,
            sender: senderId,
            reciever: receiverId,
        });
        if (newMessage) {
            chat.messages.push(newMessage._id);
        }
        yield chat.save();
        return res.status(200).json(newMessage);
    }
    catch (error) {
        next(error);
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reciever = req.params.id;
    const sender = req.user.id;
    try {
        const chat = yield chatModel_1.default.findOne({
            participants: { $all: [sender, reciever] },
        }).populate('messages').populate({
            path: 'participants',
            match: { _id: reciever },
            select: 'name' // or any other fields you need
        });
        if (!chat)
            return res.status(404).json([]);
        return res.status(200).json(chat);
    }
    catch (error) {
        next(error);
    }
});
exports.getMessages = getMessages;
const getMessagedUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = req.user.id;
        // Find all chats the current user is part of
        const chats = yield chatModel_1.default.find({ participants: currentUser }).populate('participants');
        // Extract other participants' names
        const otherParticipants = chats.flatMap(chat => chat.participants.filter(p => p._id.toString() !== currentUser));
        const userNames = otherParticipants.map(user => user._id);
        const users = yield userModel_1.default.find({ _id: userNames }).select("name");
        res.json(users);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.getMessagedUsers = getMessagedUsers;
