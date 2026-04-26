import { useState, useEffect } from "react";
import * as adminService from "../../services/adminApi";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

const ROLES = ["All", "Client", "Provider"];

export default function AllUsers() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  useEffect(() => {
    adminService.getAllUsers().then(res => {
      setUsers(res.data.data);
      setLoading(false);
    });
  }, []);
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const name = (u.fullName || u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const matchSearch = !q || name.includes(q) || email.includes(q);
    const userRoleInData = (u.role || "").toLowerCase(); 
    const selectedTab = role.toLowerCase(); 
    const matchRole = selectedTab === "all" || userRoleInData === selectedTab;

    return matchSearch && matchRole;
  });
  if (loading) return <div className="text-center py-20 text-slate-500">Loading Users...</div>;

  return (
    <div className="max-h-screen max-w-screen  bg-[#141824] text-slate-100 px-5 py-10   font-sans   rounded-3xl shadow-2xl ">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-800/50 pb-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-indigo-400 font-bold mb-1 uppercase">Control Center</p>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight">
            All Users
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">
          <span className="text-md font-bold text-indigo-300 tracking-wider">
            {filtered.length} <span className="text-[15px] font-medium text-slate-500 ml-1">Users</span>
          </span>
        </div>
      </div>

      {/* Search Input */}
      <input
        className="w-full bg-[#131720] border border-slate-800 px-4 py-3 rounded-xl text-sm outline-none mb-4 focus:border-indigo-500 transition-all shadow-sm"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Role Tabs */}
      <div className="flex gap-2 mb-8 bg-[#131720] p-1 rounded-xl border border-slate-800 w-fit">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-6 py-2 text-xs font-semibold rounded-lg transition-all ${
              role === r
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((u) => {
          const name = u.fullName || u.name || u.email.split("@")[0];
          const uRole = (u.role || "client").toLowerCase();

          return (
            <div 
              key={u.id || u.email} 
              className="bg-[#131720] border border-slate-800 rounded-2xl p-5 flex gap-4 items-center transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#161b27] group"
            >
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {initials(name)}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col">
                  <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{name}</h3>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">Active User</span>
                  <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    uRole === "provider"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  }`}>
                    {uRole}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-600 font-medium">No users matching your criteria.</div>
      )}
    </div>
  );
}