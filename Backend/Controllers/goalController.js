import Goal from "../Models/Goal.js";
import User from "../Models/User.js";

export const createGoal = async(req,res)=>{
    try{
        const {clerkId,category,title,description} = req.body;
        const user = await User.findOne({clerkId});
        if(!user) return res.status(404).json({message:"User not found"});
        const goal = await Goal.create({
            userId:user._id,
            category,
            title,
            description,
        });
        res.status(201).json(goal);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
export const getMyGoals = async(req,res)=>{
    try{
        const {clerkId} = req.params;
        const user = await User.findOne({clerkId});
        if(!user) return res.status(404).json({"message":"User not found"});
        const goals = await Goal.find({
            userId:user._id,
        }).sort({createdAt:-1});
        res.status(200).json(goals);
    }
    catch(error){
        res.status(500).json({"message":error.message});
    }
}