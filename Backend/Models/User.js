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
},{timestamps:true});

export default mongoose.model("User", userSchema);
