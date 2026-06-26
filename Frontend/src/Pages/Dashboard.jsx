import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import CreateGoal from "../Components/CreateGoal";
import GoalList from "../Components/GoalList";
import PairDashboard from "../Components/PairDashboard";
import Navbar from "../Components/Navbar";

import {
  Target,
  Handshake,
  ClipboardCheck,
  Flame,
  Radar,
  ShieldAlert,
  User,
  Swords,
} from "lucide-react";

function Dashboard() {
  const [goalCount, setGoalCount] = useState(0);
  const [goals, setGoals] = useState([]);
  const { user } = useUser();

  const [mongoUser, setMongoUser] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/me/${user.id}`
        );
        setMongoUser(res.data);
        const goalsRes = await axios.get(
          `http://localhost:5000/api/goals/my/${user.id}`
        );

        setGoals(goalsRes.data);
        setGoalCount(goalsRes.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [user]);

  if (!mongoUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }


  const steps = [
    {
      number: "01",
      title: "Declare Mission",
      icon: Target,
      desc: "Choose a goal worth showing up for.",
    },
    {
      number: "02",
      title: "Form Pact",
      icon: Handshake,
      desc: "Get matched with someone chasing the same outcome.",
    },
    {
      number: "03",
      title: "Report Daily",
      icon: ClipboardCheck,
      desc: "Prove progress every day.",
    },
    {
      number: "04",
      title: "Protect Fire",
      icon: Flame,
      desc: "Miss once and both lose the streak.",
    },
  ];
  const soloGoals = goals.filter(
    (goal) => goal.mode === "solo"
  );

  const partnerGoals = goals.filter(
    (goal) => goal.mode === "partner"
  );
  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-hidden">
      <Navbar />
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-warning/10 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] border border-warning/20 bg-base-200/40 backdrop-blur-xl p-8 md:p-10 mb-8">
          <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-warning/10 blur-[120px]" />

          <div className="relative">
            <div className="badge badge-warning badge-outline mb-6">
              MISSION CONTROL
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Build streaks that survive bad days.
                </h1>

                <p className="text-base-content/70 mt-5 text-lg max-w-2xl">
                  Track missions independently or pair with someone who shares the
                  consequences. Every check-in protects a streak.
                </p>


              </div>

              {/* Right */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-base-300 bg-base-300/20 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] opacity-50">
                    Missions
                  </p>

                  <p className="text-4xl font-black mt-2">
                    {goalCount}
                  </p>
                </div>

                <div className="rounded-3xl border border-base-300 bg-base-300/20 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] opacity-50">
                    Status
                  </p>

                  <p className="text-lg font-semibold text-warning mt-3">
                    {mongoUser.isInQueue
                      ? "Searching"
                      : "Ready"}
                  </p>
                </div>

                <div className="rounded-3xl border border-base-300 bg-base-300/20 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] opacity-50">
                    Solo Missions
                  </p>

                  <p className="text-4xl font-black mt-2">
                    {soloGoals.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-base-300 bg-base-300/20 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] opacity-50">
                    Partner Missions
                  </p>

                  <p className="text-4xl font-black mt-2">
                    {partnerGoals.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Operator Card */}
          <div className="rounded-[28px] border border-base-300 bg-base-200/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.3em] opacity-50">
                OPERATOR
              </p>

              <div className="badge badge-success badge-outline">
                ACTIVE
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 rounded-2xl ring ring-primary/20">
                  <img
                    src={mongoUser.avatar}
                    alt={mongoUser.username}
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold text-lg">
                  {mongoUser.username}
                </p>

                <p className="text-sm opacity-60">
                  {mongoUser.timezone}
                </p>
              </div>
            </div>

            <div className="divider"></div>

            <div className="mt-6 rounded-2xl border border-warning/10 bg-base-300/20 p-4">
              <p className="text-warning text-sm font-medium">
                Ready For Matchmaking
              </p>

              <p className="text-sm opacity-60 mt-2">
                Create a mission and enter the queue to form a pact.
              </p>
            </div>
          </div>

          {/* Future Pact Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[28px] border border-warning/20 bg-base-200/50 backdrop-blur-xl p-8">
            <div className="absolute top-0 right-0 h-40 w-40 bg-warning/10 blur-3xl" />

            <p className="text-xs uppercase tracking-[0.3em] text-base-content/50">
              Partner Mode
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Someone will share your streak.
            </h2>

            <p className="text-base-content/70 mt-4 max-w-2xl">
              Once matched, your progress becomes linked. If either person
              misses a day, the streak resets for both. Every check-in matters.
            </p>

            <div className="mt-10 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>

                <p className="mt-3 text-sm opacity-70">
                  You
                </p>
              </div>

              <div className="animate-pulse">
                <Flame
                  className="w-10 h-10 text-warning"
                  strokeWidth={1.5}
                />
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                  <ShieldAlert
                    className="w-10 h-10 text-warning"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-3 text-sm opacity-70">
                  Future Partner
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-warning/10 bg-base-300/20 p-4">
              <p className="text-warning text-sm font-medium">
                Shared accountability changes behavior.
              </p>

              <p className="text-base-content/60 text-sm mt-2">
                The moment you're paired, your consistency affects someone
                else's streak too.
              </p>
            </div>
          </div>
        </div>

        {/* Pact Flow */}
        <section className="rounded-[28px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <Swords className="w-6 h-6 text-warning" strokeWidth={2} />

            <h2 className="text-2xl font-bold">
              The Pact
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group rounded-3xl border border-base-300 bg-base-300/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-warning/30"
              >
                <div>
                  <step.icon
                    className="w-10 h-10 text-warning"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="text-warning text-sm mt-6">
                  {step.number}
                </div>

                <h3 className="font-semibold mt-1">
                  {step.title}
                </h3>

                <p className="text-sm opacity-60 mt-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Dashboard;