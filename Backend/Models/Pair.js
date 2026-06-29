import mongoose from "mongoose";
const pairSchema = new mongoose.Schema({
    user1Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    user2Id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    goalCategory:{
        type:String,
        enum:[
            "Coding",
        "Fitness",
        "Reading",
        "Language",
        "Project",
        "Other",
        ],
        required:true,
    },
    streakCount:{
        type:Number,
        default:0,
    },
    longestStreak:{
        type:Number,
        default:0,
    },
    lastBothCheckedIn:{
        type:Date,
        default:null,
    },
    status:{
        type:String,
        enum:["active","broken","ended"],
        default:"active",
    },
    freezesUsed:{
        user1:{
            type:Number,
            default:0,
        },
        user2:{
            type:Number,
            default:0,
        },
    },
    lastFreezeReset:{
        type:Date,
        default:Date.now()
    },
    goal1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
        required: true,
    },

    goal2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
        required: true,
    },

},{timestamps:true});

export default mongoose.model("Pair",pairSchema);