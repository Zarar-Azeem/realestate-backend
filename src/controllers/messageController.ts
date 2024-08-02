import { NextFunction, Request, Response } from "express";
import Chat from "../models/chatModel";
import User from "../models/userModel";
import Message from '../models/messageModel'


export const sendMessage = async (req: Request ,res: Response , next: NextFunction) => {
  const { input , id : receiverId } = req.body
  const senderId = req.user.id
   
  try {
    let chat = await Chat.findOne({
      participants: { $all : [senderId, receiverId]}
    })
  
    if(!chat){
        chat = await Chat.create({
          participants: [senderId,receiverId]
        })
    }
  
    const newMessage = await Message.create({
      message:input,
      sender:senderId,
      reciever:receiverId,
    })
  
    if(newMessage){
      chat.messages.push(newMessage._id)
    }
  
    await chat.save()
  
    return res.status(200).json(newMessage)
  } catch (error) {
    next(error)
  }

}

export const getMessages = async (req: Request ,res: Response , next: NextFunction) => {
    const reciever = req.params.id
    const sender = req.user.id
    try {
      
      const chat = await Chat.findOne({
        participants: { $all: [sender, reciever] },
      }).populate('messages').populate({
        path: 'participants',
        match: { _id: reciever },
        select: 'name' // or any other fields you need
      })

      if(!chat) return res.status(404).json([])
      
      return res.status(200).json(chat)

    } catch (error) {
      next(error)
    }
}

export const getMessagedUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = req.user.id;

    // Find all chats the current user is part of
    const chats = await Chat.find({ participants: currentUser }).populate('participants');

    // Extract other participants' names
    const otherParticipants = chats.flatMap(chat => chat.participants.filter(p => p._id.toString() !== currentUser));
    const userNames = otherParticipants.map(user => user._id)
    const users = await User.find({_id: userNames}).select("name")

    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
};