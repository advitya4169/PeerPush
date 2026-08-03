import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

import Navbar from "../Components/Navbar";
import CreateGoal from "../Components/CreateGoal";
import GoalList from "../Components/GoalList";

function Missions() {
  // Access authenticated user data from Clerk
  const { user } = useUser();

  // State to store the user's goals list and total count
  const [goals, setGoals] = useState([]);
  const [goalCount, setGoalCount] = useState(0);

  // Fetch the user's existing goals whenever the authenticated user updates
  useEffect(() => {
    if (!user) return;

    const fetchGoals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/goals/my/${user.id}`
        );
        console.log("GOALS FROM API:", res.data);

        // Update state with fetched goals and total count
        setGoals(res.data);
        setGoalCount(res.data.length);
      } catch (error) {
        console.log("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, [user]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Component to create a new goal / mission */}
        <CreateGoal
          goals={goals}
          setGoals={setGoals}
          setGoalCount={setGoalCount}
        />

        {/* Component to list and manage existing goals */}
        <div className="mt-10">
          <GoalList
            goals={goals}
            setGoals={setGoals}
          />
        </div>
      </div>
    </div>
  );
}

export default Missions;