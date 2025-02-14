import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUserForSidebar = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUser);
    } catch (error) {

        console.error(`Error in getUserForSidebar: ${error.message}`);
        res.status(500).json({error:"Internal server erorr"})
        
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatid} =req.params

        const myId = req.user._id;
        const message = await Message.find({
            $or:[
                {senderId:myId, recieverId:userToChatid},
                {senderId:userToChatId, recieverId:myId},
            ]
        })
        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessage controller:",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}


export const sendMessage = async(req,res)=>{
    try {
        const {text, image} =req.body;
        const{id: reciverId} =req.params;
        const sendeId = req.user._id
        
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
           
            imageUrl = uploadResponse.secure_url;

            const newMessage = new Message({
                senderId,
                reciverId,
                text,
                image:imageUrl
            })
            await newMessage.save();

            //socketiohere

            res.status(201).json(newMessage)
        }
    } catch (error) {
        console.log("");
        
    }
}