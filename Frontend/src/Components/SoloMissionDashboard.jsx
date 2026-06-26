import { ArrowLeft, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SoloMissionDashboard({ mission }) {
    const navigate = useNavigate();
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
            <div className="rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

                <div className="flex items-start justify-between gap-6">

                    <div>
                        <div className="badge badge-warning badge-outline mb-4">
                            ACTIVE MISSION
                        </div>

                        <h1 className="text-5xl font-black tracking-tight">
                            {mission.title}
                        </h1>

                        <p className="mt-4 text-lg text-base-content/60 max-w-2xl">
                            {mission.description}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-6">

                            <div className="badge badge-outline">
                                {mission.category}
                            </div>

                            <div className="badge badge-primary">
                                Solo Mission
                            </div>

                            <div
                                className={`badge ${mission.status === "active"
                                    ? "badge-success"
                                    : mission.status === "searching"
                                        ? "badge-warning"
                                        : "badge-outline"
                                    }`}
                            >
                                {mission.status}
                            </div>

                        </div>
                    </div>

                    <div className="hidden lg:flex h-24 w-24 rounded-3xl bg-warning/10 border border-warning/20 items-center justify-center">
                        <Target className="w-12 h-12 text-warning" />
                    </div>

                </div>
            </div>
            {/* Mission Stats */}
            <div className="grid md:grid-cols-3 gap-5 mt-8">

                {/* Current Streak */}
                <div className="rounded-[28px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-6 transition-all hover:border-warning/30">

                    <p className="text-xs uppercase tracking-[0.25em] text-base-content/50">
                        Current Streak
                    </p>

                    <h2 className="text-5xl font-black mt-4">
                        {mission.currentStreak}
                    </h2>

                    <p className="text-base-content/60 mt-2">
                        Consecutive days
                    </p>

                </div>

                {/* Longest */}
                <div className="rounded-[28px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-6 transition-all hover:border-warning/30">

                    <p className="text-xs uppercase tracking-[0.25em] text-base-content/50">
                        Longest Streak
                    </p>

                    <h2 className="text-5xl font-black mt-4">
                        {mission.longestStreak}
                    </h2>

                    <p className="text-base-content/60 mt-2">
                        Personal best
                    </p>

                </div>

                {/* Status */}
                <div className="rounded-[28px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-6 transition-all hover:border-warning/30">

                    <p className="text-xs uppercase tracking-[0.25em] text-base-content/50">
                        Today's Status
                    </p>

                    <h2
                        className={`text-2xl font-bold mt-5 ${mission.status === "active"
                            ? "text-success"
                            : mission.status === "searching"
                                ? "text-warning"
                                : "text-base-content"
                            }`}
                    >
                        Pending
                    </h2>

                    <p className="text-base-content/60 mt-2">
                        Waiting for today's check-in
                    </p>

                </div>

            </div>
            {/* Today's Mission */}
            <section className="mt-8 rounded-[32px] border border-warning/20 bg-base-200/40 backdrop-blur-xl p-8">

                <div className="flex items-center justify-between">

                    <div>
                        <div className="badge badge-warning badge-outline mb-4">
                            TODAY'S MISSION
                        </div>

                        <h2 className="text-3xl font-black">
                            Stay consistent.
                        </h2>

                        <p className="mt-3 text-base-content/60">
                            Complete today's objective before submitting your check-in.
                        </p>
                    </div>

                    <div className="hidden lg:flex h-16 w-16 rounded-2xl bg-warning/10 border border-warning/20 items-center justify-center">
                        <Target className="w-8 h-8 text-warning" />
                    </div>

                </div>

                <div className="divider my-8"></div>

                <div className="space-y-4">

                    <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-300/20 p-5">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>

                        <p className="font-medium">
                            Complete today's planned work.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-300/20 p-5">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>

                        <p className="font-medium">
                            Prepare proof of your progress.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-300/20 p-5">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>

                        <p className="font-medium">
                            Submit today's check-in before the day ends.
                        </p>
                    </div>

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

                {/* Proof Type */}
                <div>

                    <label className="font-semibold">
                        Proof Type
                    </label>

                    <div className="flex gap-3 mt-4">

                        <button className="btn btn-warning btn-sm">
                            Text
                        </button>

                        <button className="btn btn-outline btn-sm">
                            Link
                        </button>

                        <button className="btn btn-outline btn-sm">
                            Image
                        </button>

                    </div>

                </div>

                {/* Text Area */}

                <textarea
                    className="textarea textarea-bordered w-full h-40 mt-6 rounded-2xl"
                    placeholder="Describe what you accomplished today..."
                />

                <div className="flex justify-end mt-6">

                    <button className="btn btn-warning btn-wide">
                        Submit Check-in
                    </button>

                </div>

            </section>

            {/* Mission Progress */}
            <section className="mt-8 rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

                <div className="flex items-center justify-between">

                    <div>
                        <div className="badge badge-outline mb-4">
                            PROGRESS
                        </div>

                        <h2 className="text-3xl font-black">
                            Mission Progress
                        </h2>
                    </div>

                    <div className="text-right">

                        <p className="text-5xl font-black">
                            63%
                        </p>

                        <p className="text-base-content/60">
                            Completion
                        </p>

                    </div>

                </div>

                <progress
                    className="progress progress-warning w-full mt-8 h-4"
                    value="63"
                    max="100"
                />

                <p className="mt-4 text-base-content/60">
                    23 of 36 planned check-ins completed.
                </p>

            </section>

            {/* Bottom Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">

                {/* Activity */}

                <section className="rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

                    <div className="badge badge-outline mb-4">
                        ACTIVITY
                    </div>

                    <h2 className="text-2xl font-bold mb-8">
                        Recent Check-ins
                    </h2>

                    <div className="space-y-6">

                        <div>
                            <p className="text-sm opacity-50">
                                Today
                            </p>

                            <p className="font-medium mt-1">
                                Solved LC 560
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-50">
                                Yesterday
                            </p>

                            <p className="font-medium mt-1">
                                Revised Sliding Window
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-50">
                                2 Days Ago
                            </p>

                            <p className="font-medium mt-1">
                                Built Navbar
                            </p>
                        </div>

                    </div>

                </section>

                {/* Statistics */}

                <section className="rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

                    <div className="badge badge-outline mb-4">
                        STATISTICS
                    </div>

                    <h2 className="text-2xl font-bold mb-8">
                        Mission Statistics
                    </h2>

                    <div className="space-y-6">

                        <div className="flex justify-between">
                            <span className="opacity-60">Created</span>
                            <span>Apr 12, 2026</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="opacity-60">Current Streak</span>
                            <span>{mission.currentStreak ?? 0} Days</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="opacity-60">Longest Streak</span>
                            <span>{mission.longestStreak ?? 0} Days</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="opacity-60">Total Check-ins</span>
                            <span>31</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="opacity-60">Success Rate</span>
                            <span>86%</span>
                        </div>

                    </div>

                    <div className="divider my-8"></div>

                    <div className="rounded-2xl bg-warning/10 border border-warning/20 p-5">

                        <p className="text-warning font-semibold">
                            Consistency
                        </p>

                        <p className="mt-2 text-base-content/70">
                            You've checked in for{" "}
                            <span className="font-bold">
                                {mission.currentStreak ?? 0} consecutive days
                            </span>.
                            Keep the streak alive.
                        </p>

                    </div>

                </section>

            </div>
        </div>
    );
}

export default SoloMissionDashboard;