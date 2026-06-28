function MissionProgress({
  completedCheckIns,
  targetCheckIns,
}) {
  const progress =
    targetCheckIns > 0
      ? (completedCheckIns / targetCheckIns) * 100
      : 0;

  const remaining = Math.max(
    targetCheckIns - completedCheckIns,
    0
  );

  return (
    <section className="mt-8 rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

      <div className="flex items-center justify-between">

        <div>
          <div className="badge badge-warning badge-outline mb-4">
            PROGRESS
          </div>

          <h2 className="text-4xl font-black">
            {Math.round(progress)}%
          </h2>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold">
            {completedCheckIns} / {targetCheckIns}
          </p>

          <p className="text-base-content/60">
            Check-ins completed
          </p>
        </div>

      </div>

      <progress
        className="progress progress-warning w-full mt-8 h-4"
        value={progress}
        max="100"
      />

      <p className="mt-4 text-base-content/60">
        {remaining} check-ins remaining
      </p>

    </section>
  );
}

export default MissionProgress;