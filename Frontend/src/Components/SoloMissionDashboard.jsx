import { ArrowLeft, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";
import { uploadImage } from "../Utils/uploadImage.js";
import MissionHeader from "./MissionHeader.jsx";
import MissionStats from "./MissionStats.jsx";
import MissionProgress from "./MissionProgress.jsx";
import MissionActivity from "./MissionActivity.jsx";
import MissionStatistics from "./MissionStatistics.jsx";
import MissionCheckIn from "./MissionCheckIn.jsx";
function SoloMissionDashboard({ mission: initialMission }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const { user } = useUser();
    const [proofType, setProofType] = useState("text");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [checkIns, setCheckIns] = useState([]);
    const [checkedInToday, setCheckedInToday] = useState(false);
    const [mission, setMission] = useState(initialMission);
    const fetchCheckIns = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/solo-checkins/${mission._id}`
            );

            setCheckIns(res.data);

            const today = new Date().toISOString().split("T")[0];

            const todaysCheckIn = res.data.find((checkIn) => {
                return (
                    new Date(checkIn.date).toISOString().split("T")[0] === today
                );
            });

            setCheckedInToday(!!todaysCheckIn);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async () => {
        if (proofType === "text" || proofType === "link") {
            if (!content.trim()) return;
        }

        if (proofType === "image" && !image) {
            return;
        }

        try {
            setLoading(true);
            let finalContent = content;

            if (proofType === "image") {
                if (!image) {
                    alert("Please select an image.");
                    setLoading(false);
                    return;
                }

                finalContent = await uploadImage(image);
            }
            const res = await axios.post(
                "http://localhost:5000/api/solo-checkins",
                {
                    clerkId: user.id,
                    goalId: mission._id,
                    proofType,
                    content: finalContent,
                }
            );


            setContent("");
            setImage(null);
            setPreview("");
            setMission(res.data.goal);
            await fetchCheckIns();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCheckIns();
    }, []);
    const updateStatus = async (status) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/goals/${mission._id}/status`,
                { status }
            );

            navigate("/missions");
        } catch (error) {
            console.log(error);
        }
    };
    const progress = mission.targetCheckIns > 0 ? (mission.completedCheckIns / mission.targetCheckIns) * 100 : 0;
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            {/* Back */}
            <button
                onClick={() => navigate("/missions")}
                className="btn btn-ghost btn-sm gap-2 mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Missions
            </button>

            {/* Mission Header */}
            <MissionHeader
                mission={mission}
                missionType="Solo Mission"
            />
            {/* Mission Stats */}
            <MissionStats
                currentStreak={mission.currentStreak}
                longestStreak={mission.longestStreak}
                checkedInToday={checkedInToday}
            />
            {/* Today's Mission */}
            <section className="mt-8 rounded-[32px] border border-warning/20 bg-base-200/40 backdrop-blur-xl p-8">

                <div className="flex items-center justify-between">

                    <div>
                        <div className="badge badge-warning badge-outline mb-4">
                            TODAY'S MISSION
                        </div>

                        <h2 className="text-3xl font-black">
                            {mission.title}
                        </h2>

                        <p className="mt-3 text-base-content/60">
                            Complete today's objective before submitting your check-in.
                        </p>
                    </div>

                </div>

                <div className="divider my-8"></div>

                <div className="rounded-3xl border border-warning/20 bg-warning/5 p-6">

                    <p className="text-xs uppercase tracking-[0.25em] text-warning mb-4">
                        DAILY TARGET
                    </p>

                    <p className="text-2xl font-semibold leading-relaxed">
                        {mission.dailyTarget}
                    </p>

                </div>

            </section>

            {/* Daily Check-in */}
            <section className="mt-8 rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

                <div className="flex items-center justify-between">

                    <div>
                        <div className="badge badge-outline mb-4">
                            DAILY CHECK-IN
                        </div>

                        <h2 className="text-3xl font-black">
                            Submit today's proof.
                        </h2>

                        <p className="mt-3 text-base-content/60">
                            Every successful check-in protects your streak.
                        </p>
                    </div>

                </div>

                <div className="divider my-8"></div>

                <MissionCheckIn
                    mission={mission}
                    checkedInToday={checkedInToday}
                    onSuccess={async () => {
                        await fetchMission();
                        await fetchCheckIns();
                    }}
                />

            </section>

            {/* Mission Progress */}
            <MissionProgress
                completedCheckIns={mission.completedCheckIns}
                targetCheckIns={mission.targetCheckIns}
            />

            {/* Bottom Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">

                {/* Activity */}

                <MissionActivity checkIns={checkIns} />

                {/* Statistics */}

                <MissionStatistics mission={mission} />

                <section className="mt-8 rounded-[32px] border border-error/20 bg-base-200/40 backdrop-blur-xl p-8">

                    <div className="flex items-center justify-between">

                        <div>
                            <div className="badge badge-outline mb-3">
                                MISSION ACTIONS
                            </div>

                            <h2 className="text-2xl font-bold">
                                Finish this mission
                            </h2>

                            <p className="mt-2 text-base-content/60">
                                Complete the mission when you've achieved your goal,
                                or abandon it if you've decided to stop.
                            </p>
                        </div>

                        <div className="flex gap-4">

                            <button
                                onClick={() => updateStatus("failed")}
                                className="btn btn-error btn-outline"
                            >
                                Abandon Mission
                            </button>

                        </div>

                    </div>

                </section>

            </div>
        </div>

    );
}

export default SoloMissionDashboard;