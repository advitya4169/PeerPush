import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import {
  Code2,
  Dumbbell,
  BookOpen,
  Languages,
  FolderGit2,
  Target,
  Lock,
  CheckCircle2,
} from "lucide-react";
function CreateGoal({ goals, setGoals, setGoalCount }) {
  const { user } = useUser();

  const [category, setCategory] = useState("Coding");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/api/goals", {
      clerkId: user.id,
      category,
      title,
      description,
    });

    setGoals((prev) => [res.data, ...prev]);
    setGoalCount((prev) => prev + 1);

    setTitle("");
    setDescription("");

    document.getElementById("goal_success_modal")?.showModal();
  } catch (error) {
    console.log(error);
  }
};

  const categories = [
    { name: "Coding", icon: Code2 },
    { name: "Fitness", icon: Dumbbell },
    { name: "Reading", icon: BookOpen },
    { name: "Language", icon: Languages },
    { name: "Project", icon: FolderGit2 },
    { name: "Other", icon: Target },
  ];

  return (
    <>
      <div className="relative overflow-hidden rounded-[32px] border border-warning/20 bg-base-200/40 backdrop-blur-xl p-8">
        {/* Glow */}
        <div className="absolute top-0 right-0 h-72 w-72 bg-warning/10 blur-[120px]" />

        <div className="relative z-10">
          <div className="badge badge-warning badge-outline mb-4">
            DECLARE A MISSION
          </div>

          <h2 className="text-3xl md:text-4xl font-black">
            What are you showing up for?
          </h2>

          <p className="text-base-content/70 mt-3 max-w-2xl">
            Your future partner will see this goal before deciding to walk the
            journey with you.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Categories */}
            <div>
              <p className="text-sm uppercase tracking-wider text-base-content/50 mb-4">
                Choose Mission Type
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCategory(item.name)}
                    className={`rounded-3xl border p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-warning/40
                    ${category === item.name
                        ? "border-warning bg-warning/10"
                        : "border-base-300 bg-base-300/20"
                      }`}
                  >
                    <item.icon
                      className="w-6 h-6 mb-3 text-warning"
                      strokeWidth={1.8}
                    />

                    <div className="font-medium">{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mission Title */}
            <div>
              <label className="label">
                <span className="label-text text-base-content/70">
                  Mission Name
                </span>
              </label>

              <input
                type="text"
                placeholder="Crack Binary Trees"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full h-14 text-lg bg-base-300/20"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text text-base-content/70">
                  Mission Brief
                </span>
              </label>

              <textarea
                rows={5}
                placeholder="Solve 3-5 tree problems every day and maintain consistency for 60 days..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-base-300/20"
                required
              />
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
              <div className="text-sm text-base-content/50">
                Your mission becomes the foundation of your future streak.
              </div>

              <button
                type="submit"
                className="btn btn-warning btn-lg gap-2 hover:scale-105 transition-transform"
              >
                <Lock className="w-4 h-4" />
                LOCK IN MISSION
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <dialog id="goal_success_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Mission Created
          </h3>

          <p className="py-4 text-base-content/70">
            Your mission is ready. Next step: enter matchmaking and find your
            accountability partner.
          </p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-warning">
                Continue
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default CreateGoal;