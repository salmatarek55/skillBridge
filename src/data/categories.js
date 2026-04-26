// src/data/categories.js

export const categories = [
  { id: 1, name: "Design", icon: "🎨", color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
  { id: 2, name: "FrontEnd", icon: "💻", color: "#25c4a0", bg: "rgba(37,196,160,0.12)" },
  { id: 3, name: "BackEnd", icon: "💻", color: "#25c4a0", bg: "rgba(37,196,160,0.12)" },
  { id: 4, name: "UI UX", icon: "🎨", color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
  { id: 5, name: "Mobile", icon: "📱", color: "#25c4a0", bg: "rgba(37,196,160,0.12)" },

];

export const getCategoryByName = (name) =>
  categories.find((c) => c.name === name) ?? {
    name, icon: "🔧", color: "#94a3b8", bg: "rgba(100,116,139,0.12)",
  };
