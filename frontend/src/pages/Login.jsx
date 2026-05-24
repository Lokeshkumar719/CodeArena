import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { loginUser, clearError } from "../authSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
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
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Login successful");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary">CodeArena</h1>

            <p className="text-sm text-gray-400 mt-2">
              Practice. Compete. Improve.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId", {
                  onFocus: () => {
                    dispatch(clearError());
                  },
                })}
              />

              {errors.emailId && (
                <span className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    onFocus: () => {
                      dispatch(clearError());
                    },
                  })}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <span className="text-error text-sm mt-1">
                  {errors.password.message}
                </span>
              )}

              <div className="text-right mt-2">
                <NavLink
                  to="/forgot-password"
                  className="text-sm link link-hover link-primary"
                >
                  Forgot Password?
                </NavLink>
              </div>
            </div>

            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn btn-primary ${
                  loading ? "loading btn-disabled" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <span className="text-sm">
              Don't have an account?{" "}
              <NavLink to="/signup" className="link link-primary">
                Sign Up
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
