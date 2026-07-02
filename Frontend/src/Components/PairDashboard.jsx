import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckInForm from "./CheckInForm";
import CheckInFeed from "./CheckInFeed";
import socket from "../socket";

function PairDashboard({ mission, mongoUser }) {
  const [todayStatus, setTodayStatus] = useState({
    me: false,
    partner: false,
  });
  const { user } = useUser();
  const [pair, setPair] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const fetchPair = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pairs/${mission.pairId}`
      );

      setPair(res.data);

      await fetchTodayStatus(res.data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTodayStatus = async (currentPair) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/checkIns/${mission.pairId}`
      );

      const today = new Date().toISOString().split("T")[0];

      const todays = res.data.filter(
        (checkIn) =>
          checkIn.date.split("T")[0] === today
      );

      const isUser1 =
        currentPair.user1Id.clerkId === user.id;

      const me = isUser1
        ? currentPair.user1Id
        : currentPair.user2Id;

      const partner = isUser1
        ? currentPair.user2Id
        : currentPair.user1Id;

      const myCheckIn = todays.find(
        (c) => c.userId._id === me._id
      );

      const partnerCheckIn = todays.find(
        (c) => c.userId._id === partner._id
      );

      setTodayStatus({
        me: !!myCheckIn,
        partner: !!partnerCheckIn,
        myTime: myCheckIn?.createdAt,
        partnerTime: partnerCheckIn?.createdAt,
      });
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

    const handleNewCheckIn = async () => {
      await fetchPair();
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
        <section className="rounded-[28px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

          <p className="text-xs tracking-[0.3em] uppercase opacity-50">
            TODAY'S MISSION
          </p>

          <div className="mt-10">

            {/* Shared Progress */}
            <div className="flex items-center gap-4">

              <div className="flex flex-col items-center min-w-[90px]">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${todayStatus.me
                      ? "bg-success shadow-[0_0_16px_rgba(34,197,94,.7)]"
                      : "bg-base-300"
                    }`}
                />
                <p className="mt-3 text-xs uppercase tracking-wider opacity-50">
                  You
                </p>
                <p className="mt-1 font-medium">
                  {todayStatus.me ? "Reported" : "Waiting"}
                </p>

                {todayStatus.myTime && (
                  <p className="text-xs opacity-50 mt-1">
                    {new Date(todayStatus.myTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>

              <div className="flex-1 relative h-[2px] rounded-full bg-base-300 overflow-hidden">

                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ${todayStatus.me && todayStatus.partner
                      ? "w-full bg-success"
                      : todayStatus.me
                        ? "w-1/2 bg-primary"
                        : "w-0"
                    }`}
                />

              </div>

              <div className="flex flex-col items-center min-w-[90px]">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${todayStatus.partner
                      ? "bg-success shadow-[0_0_16px_rgba(34,197,94,.7)]"
                      : "bg-base-300"
                    }`}
                />
                <p className="mt-3 text-xs uppercase tracking-wider opacity-50">
                  Partner
                </p>
                <p className="mt-1 font-medium">
                  {todayStatus.partner ? "Reported" : "Waiting"}
                </p>

                {todayStatus.partnerTime && (
                  <p className="text-xs opacity-50 mt-1">
                    {new Date(todayStatus.partnerTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>

            </div>

            {/* Center Status */}
            <div className="mt-10 rounded-2xl border border-base-300 bg-base-100/40 p-6 text-center">

              <p className="text-3xl font-bold">
                {(todayStatus.me ? 1 : 0) + (todayStatus.partner ? 1 : 0)}
                <span className="text-base opacity-40"> / 2</span>
              </p>

              <p className="mt-2 text-sm uppercase tracking-[0.25em] opacity-50">
                Reports Received
              </p>

              <div className="w-full h-2 rounded-full bg-base-300 mt-6 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${todayStatus.me && todayStatus.partner
                      ? "w-full bg-success"
                      : todayStatus.me || todayStatus.partner
                        ? "w-1/2 bg-primary"
                        : "w-0"
                    }`}
                />
              </div>

              {todayStatus.me && todayStatus.partner ? (
                <>
                  <p className="mt-6 text-xl font-semibold">
                    Day Complete
                  </p>

                  <p className="opacity-60 mt-2">
                    Shared streak secured for today.
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-6 text-xl font-semibold">
                    Waiting for your partner
                  </p>

                  <p className="opacity-60 mt-2">
                    Both reports are required to secure today's streak.
                  </p>
                </>
              )}

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