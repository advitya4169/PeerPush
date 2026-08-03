import { inngest } from "./client.js";
import Pair from "../Models/Pair.js";
import CheckIn from "../Models/CheckIn.js";

/**
 * Inngest function that runs daily to validate daily streaks for active pairs.
 * Triggered via a cron job every day at midnight (00:00) in the Asia/Kolkata timezone.
 */
export const validateDailyStreaks = inngest.createFunction(
  {
    id: "validate-daily-streaks",
    // Cron configuration to run at midnight daily in IST
    cron: "TZ=Asia/Kolkata 0 0 * * *",
  },
  async ({ step }) => {
    // Determine yesterday's date to validate check-ins for the previous day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Format the date to YYYY-MM-DD string format matching database records
    const dateToValidate = yesterday
      .toISOString()
      .split("T")[0];
      
    console.log("INNGEST RUNNING");

    // Fetch all active pairs from the database using an Inngest step
    const pairs = await step.run("fetch-active-pairs", async () => {
      return await Pair.find({ status: "active" });
    });

    // Iterate through each active pair to evaluate daily check-in statuses
    for (const pair of pairs) {
      // Check if user 1 checked in for the target date
      const user1CheckIn = await step.run(`check-user1-${pair._id}`, async () => {
        return await CheckIn.findOne({
          pairId: pair._id,
          userId: pair.user1Id,
          date: dateToValidate
        });
      });

      // Check if user 2 checked in for the target date
      const user2CheckIn = await step.run(`check-user2-${pair._id}`, async () => {
        return await CheckIn.findOne({
          pairId: pair._id,
          userId: pair.user2Id,
          date: dateToValidate,
        });
      });

      // If both users checked in, the streak is maintained; proceed to the next pair
      if (user1CheckIn && user2CheckIn) {
        continue;
      }

      // Handle case where user 1 missed the check-in but user 2 checked in
      if (!user1CheckIn && user2CheckIn) {
        // Check if user 1 has available freezes left (assuming limit logic, e.g., < 1 or similar threshold)
        if (pair.freezesUsed.user1 < 1) {
            await step.run(`use-freeze-user1-${pair._id}`,
                async () => {
                    pair.freezesUsed.user1 += 1;
                    return await pair.save();
                }
            );
            console.log(`Freeze used for user1 in pair ${pair._id}`);
            continue;
        }
      }

      // TODO: Handle missing case for user2 when user1 checked in (mirror logic can be added if needed)

      // If requirements/freezes aren't met, reset the streak count to 0
      await step.run(`reset-streak-${pair._id}`,
        async () => {
            pair.streakCount = 0;
            return await pair.save();
        }
      );
    }

    // Return success status after processing all pairs
    return {
      success: true,
    };
  }
);

/**
 * Inngest function that runs monthly to reset freeze counts for all pairs.
 * Triggered via a cron job on the 1st of every month at midnight (00:00) in Asia/Kolkata.
 */
export const resetMonthlyFreezes = inngest.createFunction(
    {
      id: "reset-monthly-freezes",
      // Cron configuration to run on the 1st day of every month at midnight IST
      cron: "TZ=Asia/Kolkata 0 0 1 * *",
    },
    async ({ step }) => {
      // Fetch all pairs regardless of their current status
      const pairs = await step.run(
        "fetch-pairs",
        async () => {
          return await Pair.find({});
        }
      );

      // Iterate through each pair to reset monthly freeze usages
      for (const pair of pairs) {
        await step.run(
          `reset-freezes-${pair._id}`,
          async () => {
            // Reset freeze usage counts for both users back to 0
            pair.freezesUsed.user1 = 0;
            pair.freezesUsed.user2 = 0;

            // Update the timestamp of the last freeze reset
            pair.lastFreezeReset = new Date();

            await pair.save();
          }
        );
      }

      // Return success status after resetting freezes for all pairs
      return {
        success: true,
      };
    }
  );