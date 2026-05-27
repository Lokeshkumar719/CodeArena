import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { NavLink } from "react-router";
import toast from "react-hot-toast";
import axiosClient from "../utils/axiosClient";
import useRateLimit from "../hooks/useRateLimit.jsx";

const forgotPasswordSchema = z.object({
  emailId: z.string().email("Invalid Email"),
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const { cooldown, startCooldown } = useRateLimit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axiosClient.post("/user/forgot-password", data);
      toast.success(response.data.message);
      reset();
    } catch (err) {
      if (err.rateLimitedFor) {
        startCooldown(err.rateLimitedFor);
        toast.error(err.response?.data?.message || "Too many requests. Please slow down.");
        return;
      }
      toast.error(err?.response?.data?.message || "Something went wrong");
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
          <div style={s.tagline}>Reset your password</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("emailId")}
              style={{ ...s.input, ...(errors.emailId ? s.inputError : {}) }}
            />
            {errors.emailId && (
              <span style={s.errorMsg}>{errors.emailId.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            style={{ ...s.submitBtn, opacity: isDisabled ? 0.7 : 1 }}
          >
            {loading
              ? "Sending..."
              : cooldown > 0
              ? `Wait ${cooldown}s`
              : "Send Reset Link"}
          </button>
        </form>

        <div style={s.footer}>
          <NavLink to="/login" style={s.link}>Back to Login</NavLink>
        </div>
      </div>
    </div>
  );
}

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
  logoArea: { textAlign: "center", marginBottom: "36px" },
  logo: { fontSize: "32px", fontWeight: 700, color: "#a5b4fc", marginBottom: "6px" },
  tagline: { fontSize: "13px", color: "#4b5563", fontWeight: 500 },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#9ca3af" },
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
  inputError: { borderColor: "rgba(239,68,68,0.5)" },
  errorMsg: { fontSize: "12px", color: "#f87171" },
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
  footer: { textAlign: "center", marginTop: "28px", fontSize: "13px", color: "#4b5563" },
  link: { color: "#a5b4fc", fontWeight: 600, textDecoration: "none" },
};

export default ForgotPassword;