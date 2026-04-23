export const isClient = (user) => user?.role === "client";
export const isProvider = (user) => user?.role === "provider";
export const isAdmin = (user) => user?.role === "admin";