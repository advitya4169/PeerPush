function MissionStatistics({ mission }) {
  const progress =
    mission.targetCheckIns > 0
      ? (mission.completedCheckIns / mission.targetCheckIns) * 100
      : 0;

  return (
    <section className="mt-8 rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

      <div className="badge badge-warning badge-outline mb-4">
        STATISTICS
      </div>

      <h2 className="text-3xl font-black">
        Mission Statistics
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">

        <div>
          <p className="text-sm uppercase opacity-50">
            Created
          </p>

          <p className="text-xl font-bold mt-2">
            {new Date(mission.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm uppercase opacity-50">
            Current Streak
          </p>

          <p className="text-xl font-bold mt-2">
            {mission.currentStreak}
          </p>
        </div>

        <div>
          <p className="text-sm uppercase opacity-50">
            Longest Streak
          </p>

          <p className="text-xl font-bold mt-2">
            {mission.longestStreak}
          </p>
        </div>

        <div>
          <p className="text-sm uppercase opacity-50">
            Progress
          </p>

          <p className="text-xl font-bold mt-2">
            {mission.completedCheckIns} / {mission.targetCheckIns}
          </p>

          <p className="text-sm opacity-60 mt-1">
            {Math.round(progress)}%
          </p>
        </div>

      </div>

    </section>
  );
}

export default MissionStatistics;