import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../Components/Navbar";
import PairDashboard from "../Components/PairDashboard";
import SoloMissionDashboard from "../Components/SoloMissionDashboard";

function MissionPage() {
  const { id } = useParams();

  const [mission, setMission] = useState(null);

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

  // Loading state
  if (!mission) {
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
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-black">
            Finding Your Partner
          </h1>

          <p className="mt-4 text-base-content/60">
            This mission is currently in matchmaking.
          </p>
        </div>
      ) : mission.mode === "solo" ? (
        <SoloMissionDashboard mission={mission} />
      ) : (
        <PairDashboard mission={mission} />
      )}
    </div>
  );
}

export default MissionPage;