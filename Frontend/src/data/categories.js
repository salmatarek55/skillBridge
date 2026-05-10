export const categories = [
  {
    id: 1,
    name: "Design",
    icon: "🎨",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },

  {
    id: 2,
    name: "FrontEnd",
    icon: "💻",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },

  {
    id: 3,
    name: "BackEnd",
    icon: "🛠️",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },

  {
    id: 4,
    name: "UI UX",
    icon: "✨",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },

  {
    id: 5,
    name: "Mobile",
    icon: "📱",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

export const getCategoryByName = (name) =>
  categories.find((c) => c.name === name) || {
    name,
    icon: "🔧",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  };
