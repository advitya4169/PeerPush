import { inngest } from "./client.js";
import Pair from "../Models/Pair.js";
import CheckIn from "../Models/CheckIn.js";

export const validateDailyStreaks = inngest.createFunction(
  {
    id: "validate-daily-streaks",
    // FIX: Triggers (like cron or events) belong in the first argument object
    cron: "TZ=Asia/Kolkata 0 0 * * *",
  },
  // FIX: The handler function is now the second argument
  async ({ step }) => {
    const today = new Date().toISOString().split("T")[0];
    console.log("INNGEST RUNNING");
    // Wrap the initial fetch in step.run for proper Inngest execution
    const pairs = await step.run("fetch-active-pairs", async () => {
      return await Pair.find({ status: "active" });
    });

    for (const pair of pairs) {
      const user1CheckIn = await step.run(`check-user1-${pair._id}`, async () => {
        return await CheckIn.findOne({
          pairId: pair._id,
          userId: pair.user1Id,
          date: today,
        });
      });

      const user2CheckIn = await step.run(`check-user2-${pair._id}`, async () => {
        return await CheckIn.findOne({
          pairId: pair._id,
          userId: pair.user2Id,
          date: today,
        });
      });

      if (user1CheckIn && user2CheckIn) {
        continue;
      }

      if(!user1CheckIn&&user2CheckIn){
        if(pair.freezesUsed.user1<1){
            await step.run(`use-freeze-user1-${pair._id}`,
                async()=>{
                    pair.freezesUsed.user1+=1;
                    return await pair.save();
                }
            );
            console.log(`Freeze used for user1 in pair ${pair._id}`);
            continue;
        }
      }
      await step.run(`reset-streak-${pair._id}`,
        async()=>{
            pair.streakCount=0;
            return await pair.save();
        }
      )
    }


    // Return statement sits outside the loop so it processes all pairs
    return {
      success: true,
    };
  }
);

export const resetMonthlyFreezes =
  inngest.createFunction(
    {
      id: "reset-monthly-freezes",
      cron: "TZ=Asia/Kolkata 0 0 1 * *",
    },
    async ({ step }) => {

      const pairs = await step.run(
        "fetch-pairs",
        async () => {
          return await Pair.find({});
        }
      );

      for (const pair of pairs) {

        await step.run(
          `reset-freezes-${pair._id}`,
          async () => {

            pair.freezesUsed.user1 = 0;
            pair.freezesUsed.user2 = 0;

            pair.lastFreezeReset =
              new Date();

            await pair.save();
          }
        );
      }

      return {
        success: true,
      };
    }
  );
