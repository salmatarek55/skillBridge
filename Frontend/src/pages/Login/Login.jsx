import React, { useContext } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FiStar, FiUsers, FiBriefcase, FiShield } from "react-icons/fi";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authApi";

const stats = [
  { icon: <FiUsers size={18} />, value: "10K+", label: "Active Clients" },
  { icon: <FiBriefcase size={18} />, value: "5K+", label: "Services" },
  { icon: <FiStar size={18} />, value: "4.9", label: "Avg Rating" },
  { icon: <FiShield size={18} />, value: "100%", label: "Secure" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);


  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;


  if (user) {
    return <Navigate to="/" replace />;
  }
  ////////////
  const onSubmit = async (data) => {
  try {
    const loggedUser = await loginUser(data.email, data.password);

    login(loggedUser);

    if (loggedUser.role === "provider" && !loggedUser.approved) {
      toast.error("Account pending approval");
      navigate("/account-pending");
      return;
    }

    toast.success("Login Successfully 👍");

    setTimeout(() => {
      if (loggedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (loggedUser.role === "provider") {
        navigate("/dashboard");
      } else {
        navigate("/services");
      }
    }, 300);

  } catch (err) {
    toast.error(err.message);
  }
};
return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 flex-col justify-between p-12 relative overflow-hidden">

        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="text-white text-3xl font-extrabold tracking-tight z-10">
          SkillBridge
        </div>

        {/* Center */}
        <div className="z-10">
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Find the perfect<br />
            <span className="text-white/70">freelance service</span><br />
            for your business
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-10 max-w-sm">
            Connect with top professionals, get your projects done faster and smarter.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-white/80 mb-2">{s.icon}</div>
                <p className="text-white text-xl font-black">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="z-10">
          <p className="text-white/60 text-xs italic">
            "SkillBridge helped me find amazing talent in minutes."
          </p>
          <p className="text-white/40 text-xs mt-1">— Sarah K., Product Manager</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 ">
        <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-[0px_12px_32px_rgba(28,27,34,0.08)]">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1c1b22] mb-2">Welcome back</h2>
            <p className="text-sm text-[#787584]">Sign in to continue to your workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[#1c1b22] mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-4 text-[#787584]/80"><MdOutlineEmail /></span>
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="w-full border border-[#c8c4d5] bg-[#e5e1eb]/40 rounded-md py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b309e]/20"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1c1b22] mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-[#787584]"><RiLockPasswordLine /></span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-[#c8c4d5] bg-[#e5e1eb]/40 rounded-md py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b309e]/20"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              disabled={isSubmitting}
              className="cursor-pointer w-full mt-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117]/80 rounded-full py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 duration-300"
            >
              {isSubmitting ? <LoadingSpinner /> : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#787584]">
            New to SkillBridge?{" "}
            <Link to="/register" className="text-purple-500 font-semibold hover:underline">
              Apply to join
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}