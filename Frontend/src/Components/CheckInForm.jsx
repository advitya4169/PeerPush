import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import axios from "axios";
import { uploadImage } from "../Utils/uploadImage.js";

function CheckInForm({ pairId }) {
  const { user } = useUser();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      let proofContent = content.trim();
      let proofType = "text";

      if (!proofContent && !image) {
        setError(
          "Add a progress report or upload proof before submitting."
        );
        return;
      }

      if (image) {
        proofContent = await uploadImage(image);
        proofType = "image";
      }

      await axios.post(
        "http://localhost:5000/api/checkIns",
        {
          clerkId: user.id,
          pairId,
          content: proofContent,
          proofType,
        }
      );

      setContent("");
      setImage(null);

      document
        .getElementById("checkin_success_modal")
        ?.showModal();
    } catch (error) {
      console.log(error);

      setError(
        error?.response?.data?.message ||
          "Failed to submit report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Header */}

        <div className="rounded-2xl border border-warning/10 bg-warning/5 p-4">
          <p className="font-medium text-warning">
            Daily Report
          </p>

          <p className="text-sm text-base-content/60 mt-1">
            Record today's progress and keep the shared streak alive.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Progress Text */}

        <div>
          <label className="label">
            <span className="label-text text-base-content/70">
              What progress did you make today?
            </span>
          </label>

          <textarea
            rows={6}
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Solved 5 heap questions, revised priority queues, completed one mock interview..."
            className="textarea textarea-bordered w-full bg-base-300/20 resize-none"
          />
        </div>

        {/* File Upload */}

        <div>
          <label className="label">
            <span className="label-text text-base-content/70">
              Upload Proof (Optional)
            </span>
          </label>

          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          <p className="text-xs text-base-content/50 mt-2">
            Upload a screenshot, photo, or other proof of progress.
          </p>
        </div>

        {/* Preview */}

        {image && (
          <div className="rounded-2xl border border-base-300 overflow-hidden">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full max-h-[400px] object-contain bg-base-200"
            />
          </div>
        )}

        {/* Footer */}

        <div className="flex justify-between items-center text-sm">
          <span className="text-base-content/50">
            Be specific. Your partner can see this.
          </span>

          <span className="text-base-content/40">
            {content.length} chars
          </span>
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-warning btn-lg w-full"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Submitting Report...
            </>
          ) : (
            "Submit Daily Report"
          )}
        </button>

        <div className="text-center text-sm text-base-content/50">
          Missing today's report can reset the shared streak.
        </div>
      </form>

      {/* Success Modal */}

      <dialog
        id="checkin_success_modal"
        className="modal"
      >
        <div className="modal-box">
          <h3 className="font-bold text-2xl">
            Report Submitted
          </h3>

          <p className="py-4 text-base-content/70">
            Your progress has been recorded successfully.
            The shared streak remains active.
          </p>

          <div className="alert border border-success/20 bg-success/5">
            <span>
              Waiting for your partner's report.
            </span>
          </div>

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

export default CheckInForm;