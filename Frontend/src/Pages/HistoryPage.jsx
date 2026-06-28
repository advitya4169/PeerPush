import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

import Navbar from "../Components/Navbar";

function HistoryPage() {
  const { user } = useUser();

  const [missions, setMissions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/goals/history/${user.id}`
        );

        setMissions(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10">
          <div className="badge badge-outline mb-4">
            HISTORY
          </div>

          <h1 className="text-5xl font-black">
            Mission History
          </h1>

          <p className="mt-3 text-base-content/60">
            Review completed and abandoned missions.
          </p>
        </div>

        {missions.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-base-300 p-12 text-center">
            <h2 className="text-2xl font-bold">
              No mission history yet.
            </h2>

            <p className="mt-3 text-base-content/60">
              Completed and failed missions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">

            {missions.map((mission) => (
              <div
                key={mission._id}
                className="rounded-[32px] border border-base-300 bg-base-200/40 p-7"
              >
                <div className="flex justify-between items-start">

                  <div>

                    <div
                      className={`badge ${
                        mission.status === "completed"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {mission.status}
                    </div>

                    <h2 className="text-2xl font-bold mt-4">
                      {mission.title}
                    </h2>

                    <p className="text-base-content/60 mt-2">
                      {mission.description}
                    </p>

                  </div>

                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-2 gap-6">

                  <div>
                    <p className="text-xs uppercase opacity-50">
                      Longest Streak
                    </p>

                    <p className="text-3xl font-black mt-2">
                      {mission.longestStreak ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase opacity-50">
                      Ended
                    </p>

                    <p className="font-semibold mt-2">
                      {new Date(
                        mission.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default HistoryPage;