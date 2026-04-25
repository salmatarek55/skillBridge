import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../services/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FaShieldAlt } from "react-icons/fa";

  const registerSchema = z.object({
    name: z.string()
      .nonempty("name is required")
      .min(3, "min length is 3 characters")
      .max(10, "max length is 10 characters"),
    email: z.string().email("Please enter a valid email address, e.g. example@mail.com")
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
  const role = watch("role");

const onSubmit = async (data) => {
  try {
    const { confirmPassword, ...cleanData } = data;
    const newUser = await registerUser(cleanData);
    toast.success(
      data.role === "provider"
        ? "Account submitted for approval ⏳"
        : "Account created successfully 🎉"
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

  return (
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md  z-5">
        {/* CARD */}
       <div className="bg-white/75 backdrop-blur-2xl rounded-2xl border border-indigo-100 shadow-[0_8px_40px_rgba(99,102,241,0.12)] p-7">
          <h2 className="text-xl font-semibold text-center mt-2 bg-gradient-to-r text-transparent  bg-clip-text from-purple-600 via-purple-500 to-purple-600">
            Create your account
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >

            {/* ROLE */}
            <div>
              <label className="text-xs text-gray-500 uppercase">
                I want to join as
              </label>

              <div className="flex bg-gray-200/80 rounded-lg p-1 mt-1">
                <label className="flex-1 text-center cursor-pointer">
                  <input
                    type="radio"
                    value="client"
                    {...register("role")}
                    className="hidden peer"
                  />
                  <div className="py-2 rounded-md peer-checked:bg-white peer-checked:text-purple-700">
                    Client
                  </div>
                </label>

                <label className="flex-1 text-center cursor-pointer">
                  <input
                    type="radio"
                    value="provider"
                    {...register("role")}
                    className="hidden peer"
                  />
                  <div className="py-2 rounded-md peer-checked:bg-white peer-checked:text-purple-700">
                    Provider
                  </div>
                </label>
              </div>
            </div>

            {/* PROVIDER NOTE */}
            {role === "provider" && (
              <div className="text-sm bg-blue-50 p-3 rounded">
                Provider accounts need admin approval
              </div>
            )}

            {/* NAME */}
            <input
              placeholder="Full Name"
              {...register("name")}
              className="input"
            />
            {errors.name && (
              <p className="error">{errors.name.message}</p>
            )}

            {/* EMAIL */}
            <input
              placeholder="Email"
              {...register("email")}
              className="input"
            />
            {errors.email && (
              <p className="error">{errors.email.message}</p>
            )}

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="input"
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            {/* CONFIRM */}
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="input"
            />
            {errors.confirmPassword && (
              <p className="error">
                {errors.confirmPassword.message}
              </p>
            )}

            {/* BUTTON */}
            <button
              disabled={isSubmitting}
              className="cursor-pointer w-full disabled:bg-slate-900 mt-4 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117]/80 rounded-full py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}