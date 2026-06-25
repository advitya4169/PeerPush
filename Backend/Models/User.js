import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    clerkId:{
        type:String,
        required:true,
        unique:true,
    },
    username: {
        type: String,
        default: "",
    },
    email:String,
    avatar:String,
    timezone:{
        type:String,
        default:"Asia,Kolkata",
    },
    preferredCheckInTime:{
        type:String,
        enum:["morning","evening"],
        default:"evening",
    },
    currentPairId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pair",
        default:null,
    },
    isInQueue:{
        type:Boolean,
        default:false,
    },
},{timestamps:true});

export default mongoose.model("User", userSchema);
