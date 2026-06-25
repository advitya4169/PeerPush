import Pair from "../Models/Pair.js";
import CheckIn from "../Models/CheckIn.js";
import User from "../Models/User.js";
export const getPairById = async (req, res) => {
  try {
    const { pairId } = req.params;

    const pair = await Pair.findById(pairId)
      .populate("user1Id")
      .populate("user2Id");

    if (!pair) {
      return res.status(404).json({
        message: "Pair not found",
      });
    }

    res.status(200).json(pair);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const validatePairStreak = async (req, res) => {
  try {
    const { pairId } = req.params;

    const pair = await Pair.findById(pairId);

    if (!pair) {
      return res.status(404).json({
        message: "Pair not found",
      });
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // Prevent multiple validations on same day
    if (
      pair.lastBothCheckedIn &&
      pair.lastBothCheckedIn
        .toISOString()
        .split("T")[0] === today
    ) {
      return res.status(200).json({
        success: true,
        message: "Already validated today",
        streak: pair.streakCount,
        longestStreak: pair.longestStreak,
      });
    }

    const [user1CheckIn, user2CheckIn] =
      await Promise.all([
        CheckIn.findOne({
          pairId,
          userId: pair.user1Id,
          date: today,
        }),

        CheckIn.findOne({
          pairId,
          userId: pair.user2Id,
          date: today,
        }),
      ]);

    // Both checked in
    if (user1CheckIn && user2CheckIn) {
      pair.streakCount += 1;

      pair.longestStreak = Math.max(
        pair.longestStreak,
        pair.streakCount
      );

      pair.lastBothCheckedIn = new Date();

      await pair.save();

      return res.status(200).json({
        success: true,
        message: "Streak increased successfully",
        streak: pair.streakCount,
        longestStreak: pair.longestStreak,
      });
    }

    // One or both missed
    pair.streakCount = 0;

    await pair.save();

    return res.status(200).json({
      success: false,
      message: "Streak broken",
      streak: 0,
      longestStreak: pair.longestStreak,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const useFreeze = async(req,res)=>{
  try{
    const {pairId}=req.params;
    const {clerkId}=req.body;
    const user = await User.findOne({clerkId});
    if(!user) return res.status(404).json({message:"User not found"});
    const pair = await Pair.findById(pairId);
    if(!pair) return res.status(404).json({message:"Pair not found"});
    let freezeKey;
    if(pair.user1Id.toString()===user._id.toString())
      freezeKey="user1";
    else if(pair.user2Id.toString()===user._id.toString())
      freezeKey="user2";
    else
      return res.status(404).json({message:"User not in the pair"});
    
    if(pair.freezesUsed[freezeKey]>=1)
        return res.status(200).json({message:"Freeze already used this week"});
    pair.freezesUsed[freezeKey]+=1;
    await pair.save();
    return res.status(200).json({message:"Freeze used successfully"});
  }
  catch(error){
    res.status(500).json({message:error.message});
  }
}