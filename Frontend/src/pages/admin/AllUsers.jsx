import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as adminService from "../../services/adminApi";
import { FiSearch, FiUsers } from "react-icons/fi";
import { HiOutlineUser, HiOutlineBriefcase } from "react-icons/hi2";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

const ROLES = ["All", "Client", "Provider"];

const AVATAR_COLORS = [
  "from-indigo-400 via-purple-400 to-purple-600/80",
  "from-purple-300 via-violet-400 to-violet-600",
  "from-violet-500 via-purple-400 to-indigo-600",
  "from-indigo-400 via-purple-400 to-blue-500",
];

export default function AllUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await adminService.getAllUsers();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load users");
  }, [isError]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-slate-500">
        Loading Users...
      </div>
    );
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const name = (u.fullName || u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();

    const matchSearch =
      !q || name.includes(q) || email.includes(q);

    const matchRole =
      role === "All" ||
      (u.role || "").toLowerCase() === role.toLowerCase();

    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-purple-100 p-6 sm:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-1">
              Control Center
            </p>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
              All Users
            </h1>
          </div>

          <span className="text-xs px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-semibold flex items-center gap-2">
            <FiUsers />
            {filtered.length} Users
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 text-base" />

          <input
            className="w-full bg-gray-100 border border-purple-100 focus:border-purple-300 rounded-xl py-2.5 pl-9 pr-4 text-sm text-purple-900 placeholder:text-purple-300 outline-none transition"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Role Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit border border-purple-100">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                role === r
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm"
                  : "text-purple-400 hover:text-purple-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-indigo-50/60 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 bg-purple-50 border border-purple-100 rounded-xl">
            <FiUsers className="mx-auto text-4xl text-purple-300 mb-3" />

            <p className="text-purple-400 font-medium text-sm">
              No users matching your criteria
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-purple-50">
            {filtered.map((u, idx) => {
              const name =
                u.fullName ||
                u.name ||
                u.email.split("@")[0];

              const uRole = (u.role || "client").toLowerCase();

              const avatarColor =
                AVATAR_COLORS[idx % AVATAR_COLORS.length];

              return (
                <div
                  key={u.id || u.email}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                  >
                    {initials(name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-purple-700/80 truncate">
                      {name}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {u.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <span
                    className={`text-[10px] px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 flex-shrink-0 ${
                      uRole === "provider"
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-indigo-50 text-indigo-600 border-indigo-200"
                    }`}
                  >
                    {uRole === "provider" ? (
                      <HiOutlineBriefcase className="text-xs" />
                    ) : (
                      <HiOutlineUser className="text-xs" />
                    )}

                    {uRole.charAt(0).toUpperCase() + uRole.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}