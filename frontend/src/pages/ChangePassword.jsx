import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import axiosClient from "../utils/axiosClient";
import { resetAuthState } from "../authSlice";
import useRateLimit from "../hooks/useRateLimit.jsx";

import { s } from '../styles/pages/changePasswordStyles';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { cooldown, startCooldown } = useRateLimit();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosClient.post("/user/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(response.data.message);
      dispatch(resetAuthState());
      reset();
      navigate("/login");
    } catch (err) {
      if (err.rateLimitedFor) {
        startCooldown(err.rateLimitedFor);
        toast.error(err.response?.data?.message || "Too many requests. Please slow down.");
        return;
      }
      toast.error(err?.response?.data?.message || "Something went wrong",{duration:2000});
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || cooldown > 0;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoArea}>
          <div style={s.logo}>CodeArena</div>
          <div style={s.tagline}>Change your password</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
          {/* Current Password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Current Password</label>
            <div style={s.passwordWrapper}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                onPaste={(e) => {
                  e.preventDefault();
                  toast.error("Paste is not allowed");
                }}
                onCopy={(e) => {
                  e.preventDefault();
                  toast.error("Copy is not allowed");
                }}
                onCut={(e) => {
                  e.preventDefault();
                  toast.error("Cut is not allowed");
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                }}
                {...register("currentPassword")}
                style={{
                  ...s.input,
                  paddingRight: "46px",
                  ...(errors.currentPassword ? s.inputError : {}),
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((p) => !p)}
                style={s.eyeBtn}
              >
                {showCurrentPassword ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {errors.currentPassword && (
              <span style={s.errorMsg}>{errors.currentPassword.message}</span>
            )}
          </div>

          {/* New Password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>New Password</label>
            <div style={s.passwordWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                onPaste={(e) => {
                  e.preventDefault();
                  toast.error("Paste is not allowed");
                }}
                onCopy={(e) => {
                  e.preventDefault();
                  toast.error("Copy is not allowed");
                }}
                onCut={(e) => {
                  e.preventDefault();
                  toast.error("Cut is not allowed");
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                }}
                {...register("newPassword")}
                style={{
                  ...s.input,
                  paddingRight: "46px",
                  ...(errors.newPassword ? s.inputError : {}),
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                style={s.eyeBtn}
              >
                {showNewPassword ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {errors.newPassword && (
              <span style={s.errorMsg}>{errors.newPassword.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Confirm New Password</label>
            <div style={s.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                onPaste={(e) => {
                  e.preventDefault();
                  toast.error("Paste is not allowed");
                }}
                onCopy={(e) => {
                  e.preventDefault();
                  toast.error("Copy is not allowed");
                }}
                onCut={(e) => {
                  e.preventDefault();
                  toast.error("Cut is not allowed");
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                }}
                {...register("confirmPassword")}
                style={{
                  ...s.input,
                  paddingRight: "46px",
                  ...(errors.confirmPassword ? s.inputError : {}),
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                style={s.eyeBtn}
              >
                {showConfirmPassword ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span style={s.errorMsg}>{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            style={{ ...s.submitBtn, opacity: isDisabled ? 0.7 : 1 }}
          >
            {loading
              ? "Updating..."
              : cooldown > 0
              ? `Wait ${cooldown}s`
              : "Change Password"}
          </button>
        </form>

        <div style={s.footer}>
          <NavLink to="/" style={s.link}>Back to Home</NavLink>
        </div>
      </div>
    </div>
  );
}

const EyeOn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);



export default ChangePassword;
