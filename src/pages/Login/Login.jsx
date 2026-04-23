import React, { useContext } from 'react'
import { AuthContext } from './../../context/AuthContext';
import { loginUser } from "../../services/authApi";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from 'react-icons/ri';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;
  
const onSubmit = async (data) => {
  try {
    const user = await loginUser(data.email, data.password);

    login(user);

    toast.success("Login Successfully 👍");

    setTimeout(() => {
  if (user.role === "admin") {
    navigate("/admin/dashboard");
  } 
  else if (user.role === "provider") {
    if (!user.approved) {
      navigate("/pending-approval");
    } else {
      navigate("/dashboard");
    }
  } 
  else {
    navigate("/services");
  }
}, 1000);
  } catch (err) {
    toast.error(err.message);
  }
};

  return (
    <div className="h-screen w-full flexfont-sans">
      <div className="flex-1 flex items-center justify-center p-20">

        <div className="w-full max-w-md z-5 bg-white rounded-xl p-10 shadow-[0px_12px_32px_rgba(28,27,34,0.08)]">

          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1c1b22] mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-[#787584]">
              Sign in to continue to your workspace.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* EMAIL */}
             <div>
              <label className="block text-sm font-medium text-[#1c1b22] mb-2">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-3 top-4 text-[#787584]/80">
                  <MdOutlineEmail />
                </span>

                <input
                  type="email"
                  placeholder="name@email.com"
                  className="w-full border border-[#c8c4d5] bg-[#e5e1eb]/40 rounded-md py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b309e]/20"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format"
                    }
                  })}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
                     {/* /////////// */}
            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-[#1c1b22] mb-2">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-3 top-3.5 text-[#787584]">
                  <RiLockPasswordLine />
                </span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-[#c8c4d5] bg-[#e5e1eb]/40 rounded-md py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b309e]/20"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                      message: "Password must be at least 6 chars and include a number"
                    }
                  })}
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
                        {/* //////// */}
            <button
              disabled={isSubmitting}
              className="cursor-pointer w-full disabled:bg-slate-900 mt-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117]/80 rounded-full py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60"
            >
              {isSubmitting ? <LoadingSpinner /> : "Login"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center text-sm text-[#787584]">
            New to SkillBridge Pro?{" "}
            <Link to="/register" className="text-purple-500 font-semibold hover:underline">
              Apply to join
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}