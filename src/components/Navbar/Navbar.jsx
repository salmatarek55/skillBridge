import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { isClient, isProvider, isAdmin } from "../../Roles/Roles";
import { FiMessageCircle, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // active link
  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `transition font-medium ${
      isActive(path)
        ? "text-indigo-700"
        : "text-gray-500 hover:text-indigo-700"
    }`;

  // scroll effect + close menu
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setOpenMenu(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close dropdown on route change
  useEffect(() => {
    setOpenDropdown(false);
    setOpenMenu(false);
  }, [location.pathname]);

   // click outside for avatar dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // click outside for mobile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/5 backdrop-blur-xl shadow-md border-b border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          : "bg-transparent border-b border-white/10 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-15">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-purple-500  bg-clip-text text-transparent"
        >
          SkillBridge
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link className={linkClass("/")} to="/">
            Home
          </Link>

          <Link className={linkClass("/services")} to="/services">
            Services
          </Link>

          {user && isClient(user) && (
            <Link className={linkClass("/my-requests")} to="/my-requests">
              My Requests
            </Link>
          )}

          {user && isProvider(user) && (
            <Link className={linkClass("/dashboard")} to="/dashboard">
              Dashboard
            </Link>
          )}

          {user && isAdmin(user) && (
           <>
            <Link className={linkClass("/admin/dashboard")} to="/admin/dashboard">
              Dashboard
            </Link>
            <Link className={linkClass("/admin/all-users")} to="/admin/all-users">
              Allusers
            </Link>
           
           </>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* NOT LOGGED */}
          {!user && (
            <>
              <Link className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500  to-purple-400 text-white hover:bg-indigo-900 hover:-translate-y-0.5 duration-300 transition-all" to="/login">
                Login
              </Link>

              <Link
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500  to-purple-400 text-white hover:bg-indigo-900 hover:-translate-y-0.5 transition-all duration-300"
                to="/register"
              >
                Register
              </Link>
            </>
          )}
                     {/* /////////////////////////////// */}
          {/* LOGGED */}
          {user && (
            <div ref={dropdownRef} className="flex items-center gap-4 relative">

              {/* Messages + Badge */}
              <Link
                to="/messages"
                className="relative text-gray-500 hover:text-indigo-700 text-xl"
              >
                <FiMessageCircle />

                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </Link>

              {/* Avatar */}
              <img
                src={user.avatar}
                onClick={(e) => {
                  e.stopPropagation(); 
                  setOpenDropdown(!openDropdown);
                }}
                className="w-9 h-9 rounded-full cursor-pointer border hover:ring-2 hover:ring-indigo-700 transition"
              />

              {/* Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 top-12 w-44 bg-white shadow-xl rounded-xl border text-sm overflow-hidden animate-fadeIn">

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
                            {/* /////////////////////////////// */}
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 rounded-full hover:bg-gray-200 hover:text-indigo-700 transition cursor-pointer"
          >
            {openMenu ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {openMenu && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-20 left-0 w-full flex justify-center px-4">
          <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl text-gray-600 rounded-2xl shadow-xl border p-5 flex flex-col gap-4 animate-slideDown">

            <Link className={linkClass("/")} to="/">
              Home
            </Link>

            <Link className={linkClass("/services")} to="/services">
              Services
            </Link>

            {user && isClient(user) && (
              <Link to="/my-requests">My Requests</Link>
            )}

            {user && isProvider(user) && (
              <Link to="/dashboard">Dashboard</Link>
            )}

            {user && isAdmin(user) && (
              <Link to="/admin/dashboard">Admin</Link>
            )}

            {!user && (
              <>
                <Link to="/login">Login</Link>

                <Link
                  to="/register"
                  
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}