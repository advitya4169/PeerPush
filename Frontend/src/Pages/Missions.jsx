import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

import Navbar from "../Components/Navbar";
import CreateGoal from "../Components/CreateGoal";
import GoalList from "../Components/GoalList";

function Missions() {
  const { user } = useUser();

  const [goals, setGoals] = useState([]);
  const [goalCount, setGoalCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchGoals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/goals/my/${user.id}`
        );

        setGoals(res.data);
        setGoalCount(res.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoals();
  }, [user]);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <CreateGoal
          goals={goals}
          setGoals={setGoals}
          setGoalCount={setGoalCount}
        />

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