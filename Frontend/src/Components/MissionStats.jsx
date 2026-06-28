function MissionStats({
  currentStreak,
  longestStreak,
  checkedInToday,
}) {
  return (
    <div className="grid md:grid-cols-3 gap-5 mt-8">

      {/* Current */}
      <div className="rounded-[28px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-6 transition-all hover:border-warning/30">

        <p className="text-xs uppercase tracking-[0.25em] text-base-content/50">
          Current Streak
        </p>

        <h2 className="text-5xl font-black mt-4">
          {currentStreak}
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
          {longestStreak}
        </h2>

        <p className="text-base-content/60 mt-2">
          Personal Best
        </p>

      </div>

      {/* Today */}
      <div className="rounded-[28px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-6 transition-all hover:border-warning/30">

        <p className="text-xs uppercase tracking-[0.25em] text-base-content/50">
          Today's Status
        </p>

        <h2
          className={`text-2xl font-bold mt-5 ${
            checkedInToday
              ? "text-success"
              : "text-warning"
          }`}
        >
          {checkedInToday ? "Checked In" : "Pending"}
        </h2>

        <p className="text-base-content/60 mt-2">
          Waiting for today's check-in
        </p>

      </div>

    </div>
  );
}

export default MissionStats;