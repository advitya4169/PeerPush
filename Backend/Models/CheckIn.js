import mongoose from "mongoose";
const checkInSchema = new mongoose.Schema({
    pairId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pair",
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    proof:{
        type:{
            type:String,
            enum:["text","link","image"],
            default:"text",
        },
        content:{
            type:String,
            required:true,
        },
    },
    partnerReaction:{
        type:String,
        enum: ["👍", "🔥", "💪", null],
        default: null,
    },
    date:{
        type:Date,
        required:true,
    },
},{timestamps:true});

export default mongoose.model("CheckIn",checkInSchema);