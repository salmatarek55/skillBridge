import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../services/authApi";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaHourglassHalf,
  FaShieldAlt,
} from "react-icons/fa";

const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("name is required")
      .min(3, "min length is 3 characters")
      .max(10, "max length is 10 characters"),

    email: z
      .string()
      .email("Please enter a valid email address, e.g. example@mail.com")
      .nonempty("email is required"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/\d/, "Password must contain at least one number"),

    confirmPassword: z.string().nonempty("rePassword is required"),

    role: z.enum(["client", "provider"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
    },
  });
/////////////////////////////////////
  const role = watch("role");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    try {
      const { confirmPassword: _confirmPassword, ...cleanData } = data;

      await registerUser(cleanData);

      toast.success(
        data.role === "provider" ? (
          <span className="flex items-center gap-2">
            <FaHourglassHalf /> Account submitted for approval
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FaCheckCircle /> Account created successfully
          </span>
        )
      );

      reset();

      setTimeout(() => {
        if (data.role === "provider") navigate("/account-pending");
        else navigate("/login");
      }, 1000);
    } catch (err) {
      toast.error(err.message);
    }
  };
//////////////////////////////////////////////////////////
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md z-5">

        {/* CARD */}
        <div className="bg-white/75 backdrop-blur-2xl rounded-2xl border border-indigo-100 shadow-[0_8px_40px_rgba(99,102,241,0.12)] p-7">

          <h2 className="text-xl font-semibold text-center mt-2 mb-5 bg-gradient-to-r text-transparent bg-clip-text from-purple-600 via-purple-500 to-purple-600">
            Create your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

            {/* ROLE */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
                I want to join as
              </label>

              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <label className="flex-1 text-center cursor-pointer">
                  <input type="radio" value="client" {...register("role")} className="hidden peer" />
                  <div className="py-2 rounded-lg text-sm font-medium text-gray-500 peer-checked:bg-white peer-checked:text-purple-700 peer-checked:shadow-sm flex items-center justify-center gap-2 transition-all duration-200">
                    <FaUser size={13} /> Client
                  </div>
                </label>

                <label className="flex-1 text-center cursor-pointer">
                  <input type="radio" value="provider" {...register("role")} className="hidden peer" />
                  <div className="py-2 rounded-lg text-sm font-medium text-gray-500 peer-checked:bg-white peer-checked:text-purple-700 peer-checked:shadow-sm flex items-center justify-center gap-2 transition-all duration-200">
                    <FaShieldAlt size={13} /> Provider
                  </div>
                </label>
              </div>
            </div>

            {/* PROVIDER NOTE */}
            {role === "provider" && (
              <div className="text-sm bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-2 text-blue-600">
                <FaHourglassHalf size={13} />
                Provider accounts need admin approval
              </div>
            )}

            {/* NAME */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                <input
                  placeholder="Full Name"
                  {...register("name")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm text-gray-800 placeholder-gray-300 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-purple-300 focus:border-purple-400
                    hover:border-purple-200
                    ${errors.name ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 pl-1">{errors.name.message}</p>}
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                <input
                  placeholder="Email"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm text-gray-800 placeholder-gray-300 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-purple-300 focus:border-purple-400
                    hover:border-purple-200
                    ${errors.email ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm text-gray-800 placeholder-gray-300 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-purple-300 focus:border-purple-400
                    hover:border-purple-200
                    ${errors.password ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 pl-1">{errors.password.message}</p>}
            </div>

            {/* CONFIRM */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={14} />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm text-gray-800 placeholder-gray-300 outline-none transition-all duration-200
                    focus:ring-2 focus:ring-purple-300 focus:border-purple-400
                    hover:border-purple-200
                    ${errors.confirmPassword ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-gray-200"}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 pl-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              disabled={isSubmitting}
              className="cursor-pointer w-full mt-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white rounded-full py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 disabled:opacity-60 shadow-md shadow-purple-200"
            >
              <FaCheckCircle size={15} />
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}