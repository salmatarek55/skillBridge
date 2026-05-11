import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "../../services/ServiceApi";
import { categories } from "../../data/categories";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { HiOutlineStar } from "react-icons/hi2";
import {
  FiSearch,
  FiStar,
  FiTag,
  FiFilter,
} from "react-icons/fi";

const RATINGS = [3, 3.5, 4, 4.5, 5];
const MAX_PRICE = 5000;

export default function Services() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState(0);

  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return services.filter((s) => {
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q);

      const matchCategory =
        !category || s.category?.toLowerCase() === category?.toLowerCase();

      const matchPrice = s.price <= maxPrice;
      const matchRating = s.rating >= minRating;

      return matchSearch && matchCategory && matchPrice && matchRating;
    });
  }, [services, search, category, maxPrice, minRating]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMaxPrice(MAX_PRICE);
    setMinRating(0);
  };

  const hasFilters =
    search || category || maxPrice < MAX_PRICE || minRating > 0;

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
          Explore Services
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 text-lg" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or description"
          className="w-full bg-white border border-purple-100 focus:border-purple-300 rounded-2xl py-3 pl-11 pr-4 text-sm text-purple-900 placeholder:text-gray-400 outline-none shadow-sm transition-all duration-200"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-purple-100 rounded-3xl shadow-[0_4px_24px_rgba(99,102,241,0.08)] p-5 mb-8">

        {/* Category */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-3 bg-[#F2E8FF] rounded-2xl border border-purple-50 px-4 py-3">

            <p className="text-sm font-semibold text-purple-700 min-w-fit flex items-center gap-1">
              <FiTag /> Category
            </p>

            <button
              onClick={() => setCategory("")}
              className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer ${
                !category
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              All
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.name)}
                className={`px-4 py-2 rounded-full text-sm border transition-all flex items-center gap-2 cursor-pointer ${
                  category === c.name
                    ? `${c.bg} ${c.color} ${c.border} font-semibold`
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                <span>{c.icon}</span>
                {c.name}
              </button>
            ))}

          </div>
        </div>

        {/* Price + Rating */}
        <div className="flex flex-col xl:flex-row gap-5 bg-[#F2E8FF] rounded-2xl border border-purple-50 px-4 py-3">

          {/* Price */}
          <div className="flex-1 bg-white rounded-2xl border border-purple-50 px-4 py-3">

            <div className="flex flex-wrap items-center gap-3">

              <p className="text-sm font-semibold text-purple-700 min-w-fit flex items-center gap-1">
                <FiFilter /> Price
              </p>

              <button
                onClick={() => setMaxPrice(MAX_PRICE)}
                className={`px-4 py-2 rounded-full text-sm border cursor-pointer ${
                  maxPrice === MAX_PRICE
                    ? "bg-amber-50 text-amber-700 border-amber-200 font-semibold"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                All
              </button>

              {[100, 200, 300, 400, 500].map((price) => (
                <button
                  key={price}
                  onClick={() => setMaxPrice(price)}
                  className={`px-4 py-2 rounded-full text-sm border cursor-pointer ${
                    maxPrice === price
                      ? "bg-amber-50 text-amber-700 border-amber-200 font-semibold"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  Under ${price}
                </button>
              ))}

            </div>
          </div>

          {/* Rating */}
          <div className="flex-1 bg-white rounded-2xl border border-purple-50 px-4 py-3">

            <div className="flex flex-wrap items-center gap-3">

              <p className="text-sm font-semibold text-purple-700 min-w-fit flex items-center gap-1">
                <FiStar /> Rating
              </p>

              <button
                onClick={() => setMinRating(0)}
                className={`px-4 py-2 rounded-full text-sm border cursor-pointer ${
                  minRating === 0
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                All
              </button>

              {RATINGS.map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-4 py-2 rounded-full text-sm border flex items-center gap-1 cursor-pointer ${
                    minRating === r
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200 font-semibold"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  ⭐ {r}+
                </button>
              ))}

            </div>
          </div>

        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-5 border-t border-purple-100">
            <p className="text-xs text-purple-400 font-medium">Active:</p>

            {search && (
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs">
                "{search}"
              </span>
            )}

            {category && (
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs">
                {category}
              </span>
            )}

            {maxPrice < MAX_PRICE && (
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs">
                Under ${maxPrice}
              </span>
            )}

            {minRating > 0 && (
              <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs">
                <HiOutlineStar className="text-base" /> {minRating}+
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-xs text-purple-400 hover:text-purple-700 underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-purple-100">
            <FiSearch className="text-4xl mx-auto text-purple-300 mb-3" />
            <p className="text-purple-400 font-medium text-sm mb-3">
              No services match your filters
            </p>

            <button
              onClick={clearFilters}
              className="text-xs text-purple-500 hover:text-purple-700 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-purple-400 mb-5 font-medium">
              Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((service) => (
                <ServiceCard key={service.serviceId} service={service} />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}