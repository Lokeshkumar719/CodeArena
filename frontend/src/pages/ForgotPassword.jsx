import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { NavLink } from "react-router";
import toast from "react-hot-toast";

import axiosClient from "../utils/axiosClient";

const forgotPasswordSchema = z.object({
  emailId: z.string().email("Invalid Email"),
});

function ForgotPassword() {
  const [loading, setLoading] = useState(false);

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

      const response = await axiosClient.post(
        "/user/forgot-password",
        data,
      );

      toast.success(response.data.message);

      reset();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary">
              CodeArena
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              Reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Email
                </span>
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />

              {errors.emailId && (
                <span className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary ${
                  loading
                    ? "loading btn-disabled"
                    : ""
                }`}
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <NavLink
              to="/login"
              className="link link-primary text-sm"
            >
              Back to Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;