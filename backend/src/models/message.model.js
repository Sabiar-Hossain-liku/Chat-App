import mongoose  from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        receiverID:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true,
        },
        text:{
            type:String
        },
        image:{
            type:String,
        }


    },{timestamps:true}
)
const Messege = mongoose.model("Message",messageSchema);

export default Messege;