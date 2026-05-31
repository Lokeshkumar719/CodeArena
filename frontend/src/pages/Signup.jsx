import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import toast from "react-hot-toast";
import { registerUser, clearError } from "../authSlice";
import useRateLimit from "../hooks/useRateLimit.jsx";

import { s } from '../styles/pages/signupStyles';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { cooldown, startCooldown } = useRateLimit();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const onSubmit = async ({ firstName, emailId, password }) => {
    const resultAction = await dispatch(registerUser({ firstName, emailId, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Signup successful", { duration: 500 });
      navigate("/");
    } else if (registerUser.rejected.match(resultAction)) {
      const payload = resultAction.payload;
      if (payload?.rateLimitedFor) {
        startCooldown(payload.rateLimitedFor);
      }
    }
  };

  const isDisabled = loading || cooldown > 0;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoArea}>
          <div style={s.logo}>CodeArena</div>
          <div style={s.tagline}>Practice. Compete. Improve.</div>
        </div>

        <div style={s.form}>
          {/* First Name */}
          <div style={s.fieldGroup}>
            <label style={s.label}>First Name</label>
            <input
              type="text"
              placeholder="John"
              style={{ ...s.input, ...(errors.firstName ? s.inputError : {}) }}
              {...register("firstName")}
            />
            {errors.firstName && <span style={s.errorMsg}>{errors.firstName.message}</span>}
          </div>

          {/* Email */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              style={{ ...s.input, ...(errors.emailId ? s.inputError : {}) }}
              {...register("emailId")}
            />
            {errors.emailId && <span style={s.errorMsg}>{errors.emailId.message}</span>}
          </div>

          {/* Password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{ ...s.input, paddingRight: "44px", ...(errors.password ? s.inputError : {}) }}
                {...register("password")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <span style={s.errorMsg}>{errors.password.message}</span>}
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isDisabled}
            style={{ ...s.submitBtn, opacity: isDisabled ? 0.7 : 1 }}
          >
            {loading
              ? "Signing Up..."
              : cooldown > 0
              ? `Sign Up (Wait ${cooldown}s)`
              : "Sign Up"}
          </button>
        </div>

        <div style={s.footer}>
          Already have an account?{" "}
          <NavLink to="/login" style={s.link}>Login</NavLink>
        </div>
      </div>
    </div>
  );
}

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);



export default Signup;