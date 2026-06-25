import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import socket from "../socket";

function CheckInFeed({ pairId }) {
  const { user } = useUser();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    socket.on("new-checkin", (newCheckIn) => {
      setCheckIns((prev) => [
        newCheckIn,
        ...prev,
      ]);
    });

    return () => socket.off("new-checkin");
  }, []);

  useEffect(() => {
    if (!pairId) return;

    const fetchCheckIns = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/checkins/${pairId}`
        );

        setCheckIns(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckIns();
  }, [pairId]);

  useEffect(() => {
    socket.on(
      "reaction-updated",
      ({ checkInId, reaction }) => {
        setCheckIns((prev) =>
          prev.map((checkIn) =>
            checkIn._id === checkInId
              ? {
                  ...checkIn,
                  partnerReaction: reaction,
                }
              : checkIn
          )
        );
      }
    );

    return () =>
      socket.off("reaction-updated");
  }, []);

  const reactToCheckIn = async (
    checkInId,
    reaction
  ) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/checkins/${checkInId}/react`,
        { reaction }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const reactionLabel = (reaction) => {
  switch (reaction) {
    case "👍":
      return "MISSION VERIFIED";
    case "🔥":
      return "OUTSTANDING PROGRESS";
    case "💪":
      return "CONSISTENCY MAINTAINED";
    default:
      return "AWAITING PARTNER REVIEW";
  }
};

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }

  return (
    <div>
      {checkIns.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-base-300 bg-base-200/20 p-16 text-center">

          <div className="w-16 h-16 mx-auto rounded-3xl border border-base-300 bg-base-300/20" />

          <h3 className="text-2xl font-black mt-6">
            No Activity Yet
          </h3>

          <p className="text-base-content/60 mt-3">
            Reports submitted by you and your partner
            will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-6">

          {checkIns.map((checkIn) => {
            const isMine =
              checkIn.userId?.clerkId === user?.id;

            return (
              <div
                key={checkIn._id}
                className={`relative overflow-hidden rounded-[28px] border backdrop-blur-xl transition-all duration-300
                ${
                  isMine
                    ? "border-primary/20 bg-primary/5"
                    : "border-warning/20 bg-warning/5"
                }`}
              >
                {/* Glow */}

                <div
                  className={`absolute top-0 right-0 h-48 w-48 blur-3xl opacity-20
                  ${
                    isMine
                      ? "bg-primary"
                      : "bg-warning"
                  }`}
                />

                <div className="relative p-6">

                  {/* Header */}

                  <div className="flex justify-between items-start">

                    <div className="flex items-center gap-4">

                      <div className="avatar">
                        <div className="w-14 rounded-2xl">
                          <img
                            src={
                              checkIn.userId?.avatar
                            }
                            alt="profile"
                          />
                        </div>
                      </div>

                      <div>

                        <h3 className="font-bold text-lg">
                          {isMine
                            ? "You"
                            : checkIn.userId
                                ?.username ||
                              "Partner"}
                        </h3>

                        <p className="text-sm opacity-60">
                          {new Date(
                         checkIn.createdAt || checkIn.date
                        ).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
</p>

                      </div>

                    </div>

                    <div
                      className={`badge ${
                        isMine
                          ? "badge-primary"
                          : "badge-warning"
                      }`}
                    >
                      {isMine
                        ? "YOUR REPORT"
                        : "PARTNER REPORT"}
                    </div>

                  </div>

                  {/* Content */}

                  <div className="mt-6">

                    <div className="rounded-2xl border border-base-300 bg-base-300/20 p-5">

                      {checkIn.proof.type ===
                      "image" ? (
                        <img
                          src={
                            checkIn.proof.content
                          }
                          alt="proof"
                          className="rounded-xl max-w-sm"
                        />
                      ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {
                            checkIn.proof.content
                          }
                        </p>
                      )}

                    </div>

                  </div>

                  {/* Footer */}

                  <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                      <p className="text-xs tracking-[0.25em] opacity-50">
                        PARTNER RESPONSE
                      </p>

                      <p className="mt-2 font-semibold">
                        {reactionLabel(
                          checkIn.partnerReaction
                        )}
                      </p>

                    </div>

                    {!isMine && (
<div className="join">

  <button
    className="btn btn-sm btn-outline join-item"
    onClick={() =>
      reactToCheckIn(
        checkIn._id,
        "👍"
      )
    }
  >
    Mission Verified
  </button>

  <button
    className="btn btn-sm btn-warning join-item"
    onClick={() =>
      reactToCheckIn(
        checkIn._id,
        "🔥"
      )
    }
  >
    Outstanding
  </button>

  <button
    className="btn btn-sm btn-primary join-item"
    onClick={() =>
      reactToCheckIn(
        checkIn._id,
        "💪"
      )
    }
  >
    Consistent
  </button>

</div>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default CheckInFeed;