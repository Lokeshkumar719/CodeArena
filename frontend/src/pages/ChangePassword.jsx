import { useState } from "react";

import { useDispatch } from "react-redux";

import { useNavigate, NavLink } from "react-router";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import toast from "react-hot-toast";

import axiosClient from "../utils/axiosClient";

import { resetAuthState } from "../authSlice";

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

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axiosClient.post("/user/change-password", {
        currentPassword: data.currentPassword,

        newPassword: data.newPassword,
      });

      toast.success(response.data.message);

      // backend already cleared cookies
      // now clear Redux auth state
      dispatch(resetAuthState());

      reset();

      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary">CodeArena</h1>

            <p className="text-sm text-gray-400 mt-2">Change your password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>

              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${
                    errors.currentPassword ? "input-error" : ""
                  }`}
                  {...register("currentPassword")}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.currentPassword && (
                <span className="text-error text-sm mt-1">
                  {errors.currentPassword.message}
                </span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${
                    errors.newPassword ? "input-error" : ""
                  }`}
                  {...register("newPassword")}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.newPassword && (
                <span className="text-error text-sm mt-1">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.confirmPassword && (
                <span className="text-error text-sm mt-1">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary ${
                  loading ? "loading btn-disabled" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <NavLink to="/" className="link link-primary text-sm">
              Back to Home
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;