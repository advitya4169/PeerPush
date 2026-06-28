function MissionActivity({ checkIns }) {
  return (
    <section className="rounded-[32px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

      <div className="badge badge-warning badge-outline mb-4">
        ACTIVITY
      </div>

      <h2 className="text-3xl font-black">
        Recent Check-ins
      </h2>

      <div className="divider"></div>

      {checkIns.length === 0 ? (
        <p className="text-base-content/60">
          No check-ins yet.
        </p>
      ) : (
        <div className="space-y-6">

          {checkIns.map((checkIn) => (
            <div
              key={checkIn._id}
              className="rounded-2xl border border-base-300 p-5"
            >
              <p className="text-sm opacity-60">
                {new Date(checkIn.createdAt).toLocaleDateString()}
              </p>

              <div className="font-medium mt-2">

                {checkIn.proof.type === "image" ? (
                  <img
                    src={checkIn.proof.content}
                    alt="Proof"
                    className="rounded-xl mt-2 max-h-52"
                  />
                ) : checkIn.proof.type === "link" ? (
                  <a
                    href={checkIn.proof.content}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-warning"
                  >
                    Open Link
                  </a>
                ) : (
                  <span>{checkIn.proof.content}</span>
                )}

              </div>
            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default MissionActivity;