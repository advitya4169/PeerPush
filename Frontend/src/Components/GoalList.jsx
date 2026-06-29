import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Target,
  Code2,
  Dumbbell,
  BookOpen,
  Languages,
  FolderKanban,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
function GoalList({ goals }) {
  const { user } = useUser();
  const [joiningGoal, setJoiningGoal] = useState(null);
  const navigate = useNavigate();
const joinQueue = async (goalId) => {
  try {
    setJoiningGoal(goalId);

    const res = await axios.post(
      "http://localhost:5000/api/matchmaking/join",
      {
        clerkId: user.id,
        goalId,
      }
    );

    navigate(`/missions/${goalId}`);

  } catch (error) {
    console.log(error);
  } finally {
    setJoiningGoal(null);
  }
};

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Coding":
        return <Code2 className="w-6 h-6 text-warning" />;

      case "Fitness":
        return <Dumbbell className="w-6 h-6 text-warning" />;

      case "Reading":
        return <BookOpen className="w-6 h-6 text-warning" />;

      case "Language":
        return <Languages className="w-6 h-6 text-warning" />;

      case "Project":
        return <FolderKanban className="w-6 h-6 text-warning" />;

      default:
        return <Target className="w-6 h-6 text-warning" />;
    }
  };

  return (
    <>
      <section className="space-y-6">
        <div>
          <div className="badge badge-outline mb-3">
            YOUR MISSIONS
          </div>

          <h2 className="text-3xl font-black">
            Choose your pact.
          </h2>

          <p className="text-base-content/60 mt-2">
            Once matched, your streak becomes tied to another person's effort.
          </p>
        </div>

        {goals.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-base-300 bg-base-200/30 p-12 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-warning/20 bg-warning/10">
              <Target className="h-10 w-10 text-warning" />
            </div>

            <h3 className="text-2xl font-bold">
              No missions yet
            </h3>

            <p className="text-base-content/60 mt-3">
              Create your first mission above to begin matchmaking.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal._id}
                onClick={() => navigate(`/missions/${goal._id}`)}
                className="group cursor-pointer relative overflow-hidden rounded-[28px] border border-base-300 bg-base-200/50 backdrop-blur-xl transition-all duration-300 hover:border-warning/30 hover:-translate-y-1"
              >
                {/* glow */}
                <div className="absolute top-0 right-0 h-40 w-40 bg-warning/5 opacity-0 blur-3xl transition-all duration-300 group-hover:opacity-100" />

                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                        {getCategoryIcon(goal.category)}
                      </div>

                      <div>
                        <div className="badge badge-outline badge-sm mb-2">
                          {goal.category}
                        </div>

                        <h3 className="text-xl font-bold">
                          {goal.title}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`badge ${goal.status === "active"
                        ? "badge-success"
                        : "badge-outline"
                        }`}
                    >
                      {goal.status}
                    </div>
                  </div>

                  <p className="mt-5 text-base-content/70 leading-relaxed">
                    {goal.description}
                  </p>

                  <div className="divider my-6"></div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-base-content/40">
                        Shared Streak Status
                      </p>

                      <p className="font-medium mt-1">
                        Not Paired Yet
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        joinQueue(goal._id);
                      }}
                      disabled={joiningGoal === goal._id}
                      className="btn btn-warning gap-2"
                    >
                      {joiningGoal === goal._id ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Joining...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Enter Matchmaking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <dialog id="queue_modal" className="modal">
        <div className="modal-box">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-warning/20 bg-warning/10">
            <ShieldCheck className="h-10 w-10 text-warning" />
          </div>

          <h3 className="font-bold text-2xl">
            Matchmaking Activated
          </h3>

          <p className="py-4 text-base-content/70">
            Your mission has entered the queue.
            We're now looking for someone willing to protect a streak alongside
            you.
          </p>

          <div className="alert mt-2">
            <span>
              The next person you match with can affect your streak.
            </span>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-warning">
                Let's Go
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default GoalList;