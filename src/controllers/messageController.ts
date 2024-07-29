import { NextFunction, Request, Response } from "express";
import Chat from "../models/chatModel";
import User from "../models/userModel";
import Message from '../models/messageModel'


export const sendMessage = async (req: Request ,res: Response , next: NextFunction) => {
  const { message } = req.body
  const { id : receiverId } = req.params
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
      message:message,
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
      }).populate('messages')

      if(!chat) return res.status(404).json([])
      
      return res.status(200).json(chat.messages)

    } catch (error) {
      next(error)
    }
}

export const getMessagedUsers = async (req: Request ,res: Response , next: NextFunction) => {

  const sender = req.user.id

  try {
    const messages = await Message.find({ sender }).populate('reciever');

    // Extract unique receiver IDs
    const receiverIds = messages.map(message => message.reciever._id);

    // Populate user information for each receiver ID
    const users = await User.find({ _id: { $in: receiverIds } }, 'name');


    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    next(error)
  }
}