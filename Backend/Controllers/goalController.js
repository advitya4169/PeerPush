import Goal from "../Models/Goal.js";
import User from "../Models/User.js";

export const createGoal = async(req,res)=>{
    try{
        const { clerkId, category, title, description, dailyTarget,targetCheckIns,mode } = req.body;
        const user = await User.findOne({clerkId});
        if(!user) return res.status(404).json({message:"User not found"});
        const goal = await Goal.create({
          userId: user._id,
          category,
          title,
          description,
          dailyTarget,
          targetCheckIns,
          mode,
          status: "active",
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
        userId: user._id,
        status: {
        $nin: ["completed", "failed"],
      },
}).sort({createdAt:-1});
        res.status(200).json(goals);
    }
    catch(error){
        res.status(500).json({"message":error.message});
    }
}

export const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["completed", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const goal = await Goal.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMissionHistory = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const missions = await Goal.find({
      userId: user._id,
      status: {
        $in: ["completed", "failed"],
      },
    }).sort({ updatedAt: -1 });

    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
