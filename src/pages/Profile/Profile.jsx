import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { isClient, isProvider, isAdmin } from "../../Roles/Roles";

const ROLE_CONFIG = {
  client:   { label: "Client",   bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-200"  },
  provider: { label: "Provider", bg: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-200"  },
  admin:    { label: "Admin",    bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-200"    },
};

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.client;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const QUICK_LINKS = [
    ...(isClient(user)   ? [
      { label: "My Requests", to: "/my-requests", icon: "📋" },
      { label: "Messages",    to: "/messages",    icon: "💬" },
    ] : []),
    ...(isProvider(user) ? [
      { label: "Dashboard",         to: "/dashboard",         icon: "📊" },
      { label: "My Services",       to: "/my-services",       icon: "💼" },
      { label: "Incoming Requests", to: "/incoming-requests", icon: "📥" },
      { label: "Active Orders",     to: "/orders",            icon: "📦" },
      { label: "Messages",          to: "/messages",          icon: "💬" },
    ] : []),
    ...(isAdmin(user) ? [
      { label: "Admin Dashboard",    to: "/admin/dashboard",         icon: "🛡️" },
      { label: "Pending Providers",  to: "/admin/pending-providers", icon: "👤" },
      { label: "Pending Services",   to: "/admin/pending-services",  icon: "💼" },
      { label: "All Users",          to: "/admin/all-users",         icon: "👥" },
    ] : []),
  ];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">

        {/* ── Header ── */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-indigo-50">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-purple-900 truncate">{user.name}</h1>
            <div className="flex justify-between ">
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            <span className={`inline-flex items-center -mt-1 text-[10px] font-bold px-3 py-1 rounded-full border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
              {roleConfig.label}
            </span>
            </div>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-3 mb-8">
          <p className="text-sm text-gray-400">Full Name</p>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <span className="text-lg">👤</span>
            <div>      
              <p className="text-sm font-semibold text-purple-400">{user.name}</p>
            </div>
          </div>
           <p className="text-sm text-gray-400">Email</p>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <span className="text-lg">📧</span>
            <div>
              <p className="text-sm font-semibold text-purple-400">{user.email}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Role</p>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <span className="text-lg">🎭</span>
            <div>        
              <p className="text-sm font-semibold text-purple-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* ── Quick Links ── */}
        {QUICK_LINKS.length > 0 && (
          <>
            <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-3">
              Quick Access
            </p>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.to}
                  onClick={() => navigate(link.to)}
                  className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-medium hover:bg-indigo-100 hover:border-indigo-300 transition cursor-pointer text-left"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 transition cursor-pointer"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
