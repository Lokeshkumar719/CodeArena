import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { NavLink } from "react-router";
import toast from "react-hot-toast";
import axiosClient from "../utils/axiosClient";
import useRateLimit from "../hooks/useRateLimit.jsx";

import { s } from '../styles/pages/forgotPasswordStyles';

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
      toast.error(err?.response?.data?.message || "Something went wrong",{duration:500});
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



export default ForgotPassword;