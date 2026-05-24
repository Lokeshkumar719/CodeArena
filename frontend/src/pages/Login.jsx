import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";

import { loginUser, clearError } from "../authSlice";

import toast from "react-hot-toast";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(
      loginUser(data)
    );

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Login successful");
      navigate("/");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoArea}>
          <div style={s.logo}>LeetLab</div>

          <div style={s.tagline}>
            Practice. Compete. Improve.
          </div>
        </div>

        {error && (
          <div style={s.errorBanner}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={s.form}
        >
          {/* Email */}
          <div style={s.fieldGroup}>
            <label style={s.label}>
              Email
            </label>

            <input
              type="email"
              placeholder="john@example.com"
              {...register("emailId")}
              style={{
                ...s.input,
                ...(errors.emailId
                  ? s.inputError
                  : {}),
              }}
            />

            {errors.emailId && (
              <span style={s.errorMsg}>
                {errors.emailId.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div style={s.fieldGroup}>
            <div style={s.passwordTop}>
              <label style={s.label}>
                Password
              </label>

              <NavLink
                to="/forgot-password"
                style={s.forgotLink}
              >
                Forgot Password?
              </NavLink>
            </div>

            <div style={s.passwordWrapper}>
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                {...register("password")}
                style={{
                  ...s.input,
                  paddingRight: "46px",
                  ...(errors.password
                    ? s.inputError
                    : {}),
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                style={s.eyeBtn}
              >
                {showPassword ? (
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
                ) : (
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
                )}
              </button>
            </div>

            {errors.password && (
              <span style={s.errorMsg}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div style={s.footer}>
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            style={s.link}
          >
            Sign Up
          </NavLink>
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
    boxShadow:
      "0 24px 64px rgba(0,0,0,0.5)",
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

  errorBanner: {
    background:
      "rgba(239,68,68,0.08)",
    border:
      "1px solid rgba(239,68,68,0.2)",
    borderRadius: "10px",
    color: "#f87171",
    fontSize: "13px",
    padding: "10px 14px",
    marginBottom: "20px",
    textAlign: "center",
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
    borderColor:
      "rgba(239,68,68,0.5)",
  },

  errorMsg: {
    fontSize: "12px",
    color: "#f87171",
  },

  passwordWrapper: {
    position: "relative",
  },

  passwordTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  forgotLink: {
    color: "#a5b4fc",
    fontSize: "12px",
    textDecoration: "none",
    fontWeight: 500,
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

export default Login;