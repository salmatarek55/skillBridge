import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "../../services/ServiceApi";
import { categories } from "../../data/categories";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import {
  FaSearch,
  FaPaperPlane,
  FaRocket,
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
  });

  const featured = services.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* ── Hero ── */}
      <section className="text-center py-5 sm:py-20">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
          Freelance Platform
        </p>

        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-600 bg-clip-text text-transparent leading-tight mb-4">
          Find the perfect <br className="hidden sm:block" /> skill for your project
        </h1>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate("/services")}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 text-white font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Explore Services
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-full border border-purple-200 text-purple-600 font-semibold hover:bg-purple-50 hover:-translate-y-0.5 transition-all"
          >
            Join as Provider
          </button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-3 gap-4 mb-11">
        {[
          { value: `${services.length}+`, label: "Services", icon: FaSearch },
          { value: "3+", label: "Providers", icon: FaPaperPlane },
          { value: "100%", label: "Satisfaction", icon: FaRocket },
        ].map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 text-center"
            >
              <Icon className="text-2xl text-purple-500 mx-auto mb-2" />

              <p className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
                {s.value}
              </p>

              <p className="text-xs text-gray-400 mt-1 font-medium">
                {s.label}
              </p>
            </div>
          );
        })}
      </section>

      {/* ── Categories ── */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-purple-700">
            Categories in our Platform
          </h2>

          <Link to="/services" className="text-sm text-purple-500 hover:text-gray-700 transition">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((c) => {
            const Icon = c.icon;

            return (
              <div
                key={c.id}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${c.bg} ${c.border} hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}
              >
                <Icon className={`text-3xl ${c.color}`} />

                <span className={`text-xs font-semibold ${c.color}`}>
                  {c.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Featured Services ── */}
      {featured.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-purple-700">
              Featured Services
            </h2>

            <Link to="/services" className="text-sm text-purple-500 hover:text-gray-700 transition">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((service) => (
              <ServiceCard key={service.serviceId} service={service} />
            ))}
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-purple-900 text-center mb-8">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: FaSearch,
              title: "Browse Services",
              desc: "Explore hundreds of services across categories.",
            },
            {
              icon: FaPaperPlane,
              title: "Send a Request",
              desc: "Pick a service and send request to provider.",
            },
            {
              icon: FaRocket,
              title: "Get It Done",
              desc: "Provider delivers and you rate the service.",
            },
          ].map((step, i) => {
            const Icon = step.icon;

            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 text-center hover:shadow-md transition"
              >
                <Icon className="text-3xl text-purple-500 mx-auto mb-3" />

                <p className="font-bold text-purple-900 mb-2 text-sm">
                  {step.title}
                </p>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-10 text-center text-white mb-8">
        <h2 className="text-2xl font-extrabold mb-3">
          Ready to get started?
        </h2>

        <p className="text-purple-100 text-sm mb-6 max-w-md mx-auto">
          Join SkillBridge and connect with top professionals.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 rounded-full bg-white text-purple-600 font-semibold hover:bg-purple-50 transition shadow-lg"
        >
          Get Started Free
        </button>
      </section>

    </div>
  );
}