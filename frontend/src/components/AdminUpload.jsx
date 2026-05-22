import { useParams, useNavigate, NavLink } from "react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../utils/axiosClient";

function AdminUpload() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const selectedFile = watch("videoFile")?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      const metadataResponse = await axiosClient.post("/video/save", {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      console.error("Upload error:", err);
      setError("root", {
        type: "manual",
        message: err.response?.data?.message || "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <span style={s.logo}>LeetLab</span>
          </NavLink>
        </div>
        <NavLink to="/admin" style={s.adminLink}>
          <span style={s.adminBox}>Admin Dashboard</span>
        </NavLink>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <h1 style={s.heading}>Upload Video</h1>
          <p style={s.subheading}>Upload a solution video for this problem</p>
        </div>

        <div style={s.card}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* File Input */}
            <div style={s.formGroup}>
              <label style={s.label}>Choose video file</label>
              <label style={{ ...s.fileLabel, ...(errors.videoFile ? s.fileLabelError : {}) }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#4b5563" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <span style={{ color: selectedFile ? "#e2e8f0" : "#4b5563", fontSize: "14px", fontWeight: 500 }}>
                  {selectedFile ? selectedFile.name : "Click to select a video file"}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  disabled={uploading}
                  {...register("videoFile", {
                    required: "Please select a video file",
                    validate: {
                      isVideo: (files) => {
                        if (!files || !files[0]) return "Please select a video file";
                        return files[0].type.startsWith("video/") || "Please select a valid video file";
                      },
                      fileSize: (files) => {
                        if (!files || !files[0]) return true;
                        const maxSize = 100 * 1024 * 1024;
                        return files[0].size <= maxSize || "File size must be less than 100MB";
                      },
                    },
                  })}
                />
              </label>
              {errors.videoFile && (
                <p style={s.errorText}>{errors.videoFile.message}</p>
              )}
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div style={s.infoBox}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#a5b4fc">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                  </svg>
                  <div>
                    <p style={{ fontSize: "13px", color: "#a5b4fc", fontWeight: 600, margin: 0 }}>{selectedFile.name}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>Size: {formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {uploading && (
              <div style={s.progressWrap}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>Uploading...</span>
                  <span style={{ fontSize: "13px", color: "#a5b4fc", fontWeight: 600 }}>{uploadProgress}%</span>
                </div>
                <div style={s.progressBg}>
                  <div style={{ ...s.progressFill, width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {errors.root && (
              <div style={s.errorBox}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f87171">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                </svg>
                <span style={{ fontSize: "13px", color: "#f87171" }}>{errors.root.message}</span>
              </div>
            )}

            {/* Success */}
            {uploadedVideo && (
              <div style={s.successBox}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#22c55e">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600, margin: 0 }}>Upload Successful!</p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>
                    Duration: {formatDuration(uploadedVideo.duration)} · Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
              <button
                type="submit"
                disabled={uploading}
                style={{ ...s.submitBtn, opacity: uploading ? 0.6 : 1, cursor: uploading ? "not-allowed" : "pointer" }}
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#080c14", fontFamily: "'Sora', sans-serif", color: "#c9d1d9" },
  navbar: { height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: "20px" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  logo: { fontSize: "20px", fontWeight: 700, color: "#a5b4fc" },
  adminLink: { textDecoration: "none" },
  adminBox: { fontSize: "13px", color: "#6b7280", fontWeight: 500, border: "1px solid #1e2738", borderRadius: "8px", padding: "6px 14px", background: "#0c1018" },
  main: { padding: "48px 40px", maxWidth: "600px", margin: "0 auto" },
  header: { marginBottom: "32px" },
  heading: { fontSize: "28px", fontWeight: 700, color: "#f9fafb", marginBottom: "8px" },
  subheading: { fontSize: "14px", color: "#6b7280" },
  card: { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", padding: "32px" },
  formGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#9ca3af", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" },
  fileLabel: { display: "flex", alignItems: "center", gap: "12px", border: "1px dashed #1e2738", borderRadius: "12px", padding: "20px", cursor: "pointer", background: "#0a0e18", transition: "border-color 0.2s" },
  fileLabelError: { borderColor: "rgba(239,68,68,0.4)" },
  errorText: { fontSize: "12px", color: "#f87171", marginTop: "6px" },
  infoBox: { background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" },
  progressWrap: { marginBottom: "20px" },
  progressBg: { background: "#1e2738", borderRadius: "999px", height: "6px", overflow: "hidden" },
  progressFill: { background: "linear-gradient(90deg, #6366f1, #a5b4fc)", height: "100%", borderRadius: "999px", transition: "width 0.3s ease" },
  errorBox: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" },
  successBox: { display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" },
  submitBtn: { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: "8px", color: "#a5b4fc", fontSize: "13px", fontWeight: 600, padding: "9px 24px", fontFamily: "'Sora', sans-serif" },
};

export default AdminUpload;