import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";

function GoalList() {
  const { user } = useUser();

  const [goals, setGoals] = useState([]);
  const [joiningGoal, setJoiningGoal] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchGoals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/goals/my/${user.id}`
        );

        setGoals(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoals();
  }, [user]);

  const joinQueue = async (goalId) => {
    try {
      setJoiningGoal(goalId);

      await axios.post(
        "http://localhost:5000/api/users/join-queue",
        {
          clerkId: user.id,
          goalId,
        }
      );

      document.getElementById("queue_modal")?.showModal();
    } catch (error) {
      console.log(error);
    } finally {
      setJoiningGoal(null);
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case "Coding":
        return "🧩";
      case "Fitness":
        return "💪";
      case "Reading":
        return "📚";
      case "Language":
        return "🌎";
      case "Project":
        return "🚀";
      default:
        return "🎯";
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
            <div className="text-6xl mb-4">
              🎯
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
                className="group relative overflow-hidden rounded-[28px] border border-base-300 bg-base-200/50 backdrop-blur-xl transition-all duration-300 hover:border-warning/30 hover:-translate-y-1"
              >
                {/* glow */}
                <div className="absolute top-0 right-0 h-40 w-40 bg-warning/5 opacity-0 blur-3xl transition-all duration-300 group-hover:opacity-100" />

                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center text-2xl">
                        {getCategoryEmoji(goal.category)}
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
                      className={`badge ${
                        goal.status === "active"
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
                      onClick={() => joinQueue(goal._id)}
                      disabled={joiningGoal === goal._id}
                      className="btn btn-warning"
                    >
                      {joiningGoal === goal._id ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Joining...
                        </>
                      ) : (
                        <>🔥 Enter Matchmaking</>
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
          <div className="text-5xl mb-4">
            🤝
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