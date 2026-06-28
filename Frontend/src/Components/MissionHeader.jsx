import { Target } from "lucide-react";

function MissionHeader({ mission, missionType }) {
  return (
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
              {missionType}
            </div>

            <div
              className={`badge ${
                mission.status === "active"
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
  );
}

export default MissionHeader;