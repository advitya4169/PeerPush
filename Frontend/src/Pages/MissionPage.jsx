import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

import Navbar from "../Components/Navbar";
import PairDashboard from "../Components/PairDashboard";
import SoloMissionDashboard from "../Components/SoloMissionDashboard";

function MissionPage() {
  const { id } = useParams();
  const { user } = useUser();

  const [mission, setMission] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);

  // Fetch mission
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/goals/${id}`
        );

        setMission(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMission();
  }, [id]);

  // Poll while searching
  useEffect(() => {
    if (!mission || mission.status !== "searching") return;

    const interval = setInterval(async () => {
      try {
        const statusRes = await axios.get(
          `http://localhost:5000/api/matchmaking/status/${mission._id}`
        );


        if (statusRes.data.matched) {
          const updatedMission = await axios.get(
            `http://localhost:5000/api/goals/${mission._id}`
          );


          setMission(updatedMission.data);
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [mission]);

  // Fetch mongo user
  useEffect(() => {
    if (!user) return;

    const fetchMongoUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/me/${user.id}`
        );

        setMongoUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMongoUser();
  }, [user]);

  if (!mission || !mongoUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {mission.status === "searching" ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">

          <div className="w-full max-w-2xl rounded-[36px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-12 text-center">

            <div className="badge badge-warning badge-outline">
              MATCHMAKING
            </div>

            <h1 className="text-4xl font-black mt-6">
              Finding Your Partner
            </h1>

            <p className="mt-4 text-base-content/60 max-w-lg mx-auto leading-relaxed">
              We're looking for someone pursuing a similar mission.
              You'll be matched automatically as soon as we find one.
            </p>

            <div className="flex justify-center mt-10">
              <span className="loading loading-spinner loading-lg text-warning"></span>
            </div>

            <div className="mt-12 rounded-2xl border border-base-300 bg-base-100/30 p-6 text-left">

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] opacity-50">
                    Mission
                  </p>

                  <h2 className="font-bold text-xl mt-2">
                    {mission.title}
                  </h2>
                </div>

                <div className="badge badge-outline">
                  {mission.category}
                </div>

              </div>

            </div>

            <div className="mt-8 flex items-center justify-between">

              <p className="text-sm text-base-content/50">
                Searching automatically...
              </p>

              <button
                className="btn btn-outline btn-error"
                onClick={async () => {
                  try {
                    const res = await axios.patch(
                      `http://localhost:5000/api/matchmaking/cancel/${mission._id}`
                    );

                    setMission(res.data.goal);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Cancel Search
              </button>

            </div>

          </div>

        </div>
      ) : mission.mode === "solo" ? (
        <SoloMissionDashboard mission={mission} />
      ) : (
        <PairDashboard mission={mission} mongoUser={mongoUser} />
      )}
    </div>
  );
}

export default MissionPage;