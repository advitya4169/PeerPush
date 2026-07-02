import React, { useState } from 'react'
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { uploadImage } from "../Utils/uploadImage.js";

function MissionCheckIn({ mission, checkedInToday, onSuccess, }) {
    const { user } = useUser();
    const [proofType, setProofType] = useState("text");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (proofType === "text" || proofType === "link") {
            if (!content.trim()) return;
        }

        if (proofType === "image" && !image) {
            return;
        }

        try {
            setLoading(true);
            let finalContent = content;

            if (proofType === "image") {
                if (!image) {
                    alert("Please select an image.");
                    setLoading(false);
                    return;
                }

                finalContent = await uploadImage(image);
            }
            const res = await axios.post(
                "http://localhost:5000/api/solo-checkins",
                {
                    clerkId: user.id,
                    goalId: mission._id,
                    proofType,
                    content: finalContent,
                }
            );
            setContent("");
            setImage(null);
            setPreview("");

            onSuccess(res.data.goal);
        } catch (error) {
            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div>

                <label className="font-semibold">
                    Proof Type
                </label>

                <div className="flex gap-3 mt-4">

                    <button
                        onClick={() => setProofType("text")}
                        className={`btn btn-sm ${proofType === "text" ? "btn-warning" : "btn-outline"
                            }`}
                    >
                        Text
                    </button>

                    <button
                        onClick={() => setProofType("link")}
                        className={`btn btn-sm ${proofType === "link" ? "btn-warning" : "btn-outline"
                            }`}
                    >
                        Link
                    </button>

                    <button
                        onClick={() => setProofType("image")}
                        className={`btn btn-sm ${proofType === "image" ? "btn-warning" : "btn-outline"
                            }`}
                    >
                        Image
                    </button>

                    {proofType === "image" && (
                        <div className="mt-10 relative">

                            <input
                                type="file"
                                accept="image/*"
                                className="file-input file-input-bordered w-full relative -bottom-7"
                                onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (!file) return;

                                    setImage(file);
                                    setPreview(URL.createObjectURL(file));
                                }}
                            />

                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-5 rounded-2xl border border-base-300 max-h-80 object-cover"
                                />
                            )}

                        </div>
                    )}
                </div>

            </div>

            {/* Text Area */}

            {proofType === "text" && (
                <textarea
                    className="textarea textarea-bordered w-full h-40 mt-6 rounded-2xl"
                    placeholder="Describe what you accomplished today..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            )}
            {proofType === "link" && (
                <input
                    type="url"
                    className="input input-bordered w-full mt-6"
                    placeholder="https://..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            )}

            <div className="flex justify-end mt-6">

                <button
                    onClick={handleSubmit}
                    disabled={loading || checkedInToday}
                    className="btn btn-warning btn-wide"
                >
                    {loading ? (
                        <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Submitting...
                        </>
                    ) : checkedInToday ? (
                        "Checked In Today"
                    ) : (
                        "Submit Check-in"
                    )}
                </button>

            </div>
        </div>
    )
}

export default MissionCheckIn
