import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckInForm from "./CheckInForm";
import CheckInFeed from "./CheckInFeed";
import socket from "../socket";

function PairDashboard({ mission, mongoUser }) {
  const { user } = useUser();
  const [pair, setPair] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const fetchPair = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pairs/${mission.pairId}`
      );

      setPair(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!mission?.pairId) return;

    fetchPair();
  }, [mission]);

  useEffect(() => {
    if (!pair) return;

    socket.emit("join-pair", pair._id);
  }, [pair]);

  useEffect(() => {
    if (!mission?.pairId) return;

    const handleNewCheckIn = () => {
        fetchPair();
    };

    socket.on("new-checkin", handleNewCheckIn);

    return () => {
        socket.off("new-checkin", handleNewCheckIn);
    };
}, [mission?.pairId]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;

      const hrs = Math.floor(diff / 1000 / 60 / 60);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hrs.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`
      );
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const handleStreakUpdated = (data) => {
    setPair((prev) => ({
      ...prev,
      streakCount: data.streakCount,
      longestStreak: data.longestStreak,
      lastBothCheckedIn: data.lastBothCheckedIn,
    }));
  };

  socket.on("streak-updated", handleStreakUpdated);

  return () => {
    socket.off(
      "streak-updated",
      handleStreakUpdated
    );
  };
}, []);

  if (!pair) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }

  const isUser1 = pair.user1Id.clerkId === user.id;

  const me = isUser1 ? pair.user1Id : pair.user2Id;
  const partner = isUser1 ? pair.user2Id : pair.user1Id;

  const myGoal = isUser1 ? pair.goal1Id : pair.goal2Id;
  const partnerGoal = isUser1 ? pair.goal2Id : pair.goal1Id;
  const myCheckedIn = isUser1
    ? pair.todayStatus.user1
    : pair.todayStatus.user2;

  const partnerCheckedIn = isUser1
    ? pair.todayStatus.user2
    : pair.todayStatus.user1;

  const myFreezeUsed = isUser1
    ? pair.freezesUsed.user1
    : pair.freezesUsed.user2;

  const partnerFreezeUsed = isUser1
    ? pair.freezesUsed.user2
    : pair.freezesUsed.user1;
  return (
    <div className="min-h-screen bg-base-100 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-warning/10 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[36px] border border-warning/20 bg-base-200/40 backdrop-blur-xl p-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-warning/10 blur-[120px]" />

          <div className="relative text-center">
            <div className="badge badge-warning badge-outline mb-6">
              SHARED STREAK
            </div>

            <h1 className="text-[120px] md:text-[160px] leading-none font-black tracking-tight">
              {pair.streakCount}
            </h1>

            <p className="tracking-[0.4em] text-xs opacity-60 mt-3">
              SHARED DAYS
            </p>

            <div className="mt-10 flex items-center justify-center gap-10">
              {/* YOU */}
              <div className="text-center">
                <div className="avatar">
                  <div className="w-20 rounded-3xl ring ring-primary/20 ring-offset-base-100 ring-offset-2">
                    <img
                      src={me?.avatar}
                      alt="You"
                    />
                  </div>
                </div>

                <p className="mt-3 text-sm tracking-[0.25em] opacity-70">
                  YOU
                </p>
              </div>

              {/* CONNECTION */}
              <div className="w-24 h-px bg-gradient-to-r from-warning to-primary" />

              {/* PARTNER */}
              <div className="text-center">
                <div className="avatar">
                  <div className="w-20 rounded-3xl ring ring-warning/20 ring-offset-base-100 ring-offset-2">
                    <img
                      src={partner?.avatar}
                      alt="Partner"
                    />
                  </div>
                </div>

                <p className="mt-3 text-sm tracking-[0.25em] opacity-70">
                  PARTNER
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <div className="badge badge-success">
                {myGoal.title}
              </div>

              <div className="badge badge-info">
                {partnerGoal.title}
              </div>

              <div className="badge badge-outline">
                LONGEST {pair.longestStreak}
              </div>

              <div className="badge badge-outline">
                FREEZE {1 - myFreezeUsed}
              </div>

              <div className="badge badge-outline">
                {pair.status.toUpperCase()}
              </div>

            </div>
          </div>
        </section>

        {/* INFO GRID */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* PARTNERSHIP */}
          <div className="rounded-[28px] border border-base-300 bg-base-200/50 backdrop-blur-xl p-8">
            <p className="text-xs tracking-[0.3em] opacity-50">
              PARTNERSHIP
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              {/* YOU */}
              <div className="rounded-2xl border border-base-300 p-5">
                <p className="text-xs uppercase opacity-50">
                  YOUR MISSION
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {myGoal.title}
                </h3>

                <p className="text-base-content/60 mt-3">
                  {myGoal.description}
                </p>

                <div className="divider"></div>

                <p className="text-xs uppercase opacity-50">
                  DAILY TARGET
                </p>

                <p className="mt-2 font-medium">
                  {myGoal.dailyTarget}
                </p>
              </div>

              {/* PARTNER */}
              <div className="rounded-2xl border border-base-300 p-5">
                <p className="text-xs uppercase opacity-50">
                  PARTNER'S MISSION
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {partnerGoal.title}
                </h3>

                <p className="text-base-content/60 mt-3">
                  {partnerGoal.description}
                </p>

                <div className="divider"></div>

                <p className="text-xs uppercase opacity-50">
                  DAILY TARGET
                </p>

                <p className="mt-2 font-medium">
                  {partnerGoal.dailyTarget}
                </p>
              </div>

            </div>
          </div>

          {/* COUNTDOWN */}
          <div className="rounded-[28px] border border-warning/20 bg-warning/5 backdrop-blur-xl p-8">
            <p className="text-xs tracking-[0.3em] opacity-50">
              DAILY DEADLINE
            </p>

            <div className="text-5xl md:text-6xl font-black font-mono mt-4">
              {timeLeft}
            </div>

            <p className="text-base-content/60 mt-4">
              Remaining before the daily reporting window closes.
            </p>

            <div className="divider"></div>

            <div className="text-sm opacity-60">
              Both partners must report progress before midnight.
            </div>
          </div>
        </section>

        {/* WARNING */}
        <section className="rounded-[24px] border border-warning/20 bg-warning/5 p-6">
          <p className="text-warning font-semibold">
            Streak Protection Active
          </p>

          <p className="mt-2 text-base-content/60">
            Each partner receives one freeze every month. If a daily report is
            missed, the freeze is consumed automatically and the shared streak
            survives.
          </p>

          <div className="mt-4 flex gap-3">
            <div className="badge badge-outline">
              YOUR FREEZE: {1 - myFreezeUsed}
            </div>

            <div className="badge badge-outline">
              PARTNER FREEZE: {1 - partnerFreezeUsed}
            </div>
          </div>
        </section>

        {/* REPORT SECTION */}
        <section className="rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">
          <div className="mb-8">
            <div className="w-12 h-px bg-warning mb-4" />

            <h2 className="text-3xl font-black">
              TODAY'S REPORT
            </h2>

            <p className="text-base-content/60 mt-2">
              Record today's progress and keep the streak alive.
            </p>
          </div>

          <CheckInForm pairId={pair._id} />
        </section>

        {/* ACTIVITY LOG */}
        <section className="rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">
          <div className="mb-8">
            <div className="w-12 h-px bg-warning mb-4" />

            <h2 className="text-3xl font-black">
              ACTIVITY LOG
            </h2>

            <p className="text-base-content/60 mt-2">
              Every report becomes part of your shared history.
            </p>
          </div>

          <CheckInFeed pairId={pair._id} />
        </section>
      </div>
    </div>
  );
}

export default PairDashboard;