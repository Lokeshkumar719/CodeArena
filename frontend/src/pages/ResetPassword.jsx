import { useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import axiosClient from "../utils/axiosClient";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosClient.post(`/user/reset-password/${token}`, {
        password: data.password,
      });
      toast.success(response.data.message);
      reset();
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoArea}>
          <div style={s.logo}>CodeArena</div>
          <div style={s.tagline}>Set a new password</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
          {/* New Password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>New Password</label>
            <div style={s.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                style={{
                  ...s.input,
                  paddingRight: "46px",
                  ...(errors.password ? s.inputError : {}),
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={s.eyeBtn}
              >
                {showPassword ? <EyeOff /> : <EyeOn />}
              </button>
            </div>
            {errors.password && (
              <span style={s.errorMsg}>{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Confirm Password</label>
            <div style={s.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                onPaste={(e) => {
                  e.preventDefault();
                  toast.error("Paste not allowed here");
                }}
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
            disabled={loading}
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div style={s.footer}>
          <NavLink to="/login" style={s.link}>
            Back to Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

const EyeOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const s = {
  page: {
    minHeight: "100vh",
    background: "#080c14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'Sora', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "20px",
    padding: "44px 40px",
    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "36px",
  },
  logo: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#a5b4fc",
    marginBottom: "6px",
  },
  tagline: {
    fontSize: "13px",
    color: "#4b5563",
    fontWeight: 500,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#9ca3af",
  },
  input: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontSize: "14px",
    padding: "11px 14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Sora', sans-serif",
  },
  inputError: {
    borderColor: "rgba(239,68,68,0.5)",
  },
  errorMsg: {
    fontSize: "12px",
    color: "#f87171",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    top: "50%",
    right: "12px",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#4b5563",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  submitBtn: {
    background: "#4f46e5",
    border: "1px solid #6366f1",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    padding: "12px",
    cursor: "pointer",
    marginTop: "8px",
    fontFamily: "'Sora', sans-serif",
    width: "100%",
  },
  footer: {
    textAlign: "center",
    marginTop: "28px",
    fontSize: "13px",
    color: "#4b5563",
  },
  link: {
    color: "#a5b4fc",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default ResetPassword;