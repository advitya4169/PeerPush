import mongoose from "mongoose";
const goalSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        requied:true,
    },
    category:{
        type:String,
        enum:[ "Coding",
        "Fitness",
        "Reading",
        "Language",
        "Project",
        "Other"],
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["queued","paired","completed"],
        default:"queued",
    },

},{timestamps:true});
export default mongoose.model("Goal",goalSchema);