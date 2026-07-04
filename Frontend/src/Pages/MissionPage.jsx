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
  const [matchStatus, setMatchStatus] = useState(null);
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


        if (!statusRes.data.matched) return;

        setMatchStatus(statusRes.data);

        // Equal targets OR already accepted
        if (statusRes.data.requiresAcceptance) {
          return;
        }

        if (statusRes.data.active) {
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

  useEffect(() => {
    if (matchStatus?.requiresAcceptance) {
      document
        .getElementById("accept_challenge_modal")
        ?.showModal();
    }
  }, [matchStatus]);

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
                Searching....
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
      <dialog id="accept_challenge_modal" className="modal">
        <div className="modal-box max-w-lg">

          <h3 className="font-bold text-2xl">
            Partner Found 🎉
          </h3>

          <p className="mt-6">
            <span className="font-semibold">Your challenge:</span>{" "}
            {matchStatus?.yourTarget} days
          </p>

          <p className="mt-2">
            <span className="font-semibold">Partner's challenge:</span>{" "}
            {matchStatus?.partnerTarget} days
          </p>

          <div className="divider"></div>

          <p className="text-base-content/70 leading-relaxed">
            This partnership follows the longer challenge (
            {Math.max(
              matchStatus?.yourTarget || 0,
              matchStatus?.partnerTarget || 0
            )}{" "}
            days).
          </p>

          <p className="mt-4 text-base-content/70">
            If you accept, you'll continue checking in after completing your own
            goal so both partners can finish together.
          </p>

          <div className="modal-action">

            <button
              className="btn btn-outline"
              onClick={async () => {
                await axios.patch(
                  `http://localhost:5000/api/matchmaking/cancel/${mission._id}`
                );

                window.location.reload();
              }}
            >
              Leave Queue
            </button>

            <button
              className="btn btn-warning"
              onClick={async () => {
                await axios.patch(
                  `http://localhost:5000/api/matchmaking/accept/${matchStatus.pairId}`
                );

                const updatedMission = await axios.get(
                  `http://localhost:5000/api/goals/${mission._id}`
                );

                setMission(updatedMission.data);

                document
                  .getElementById("accept_challenge_modal")
                  ?.close();
              }}
            >
              Accept Challenge
            </button>

          </div>

        </div>
      </dialog>
    </div>
  );
}

export default MissionPage;