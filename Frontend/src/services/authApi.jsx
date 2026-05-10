import api from "./axiosInstance";


const normalizeRole = (role) => {
  if (!role) return "client";
  return role.toLowerCase(); 
};

const ROLE_MAP = {
  client:   3,
  provider: 2,
  admin:    1,
};
export async function loginUser(email, password) {
  const res = await api.post("/Auth/login", { email, password });
  const data = res.data.data;

  const role = normalizeRole(data.role);
  
  return {
    id:       data.id         || data.userId || null,
    name:     data.fullName   || data.name,
    email:    data.email,
    role:     role,
    approved: role === "provider" 
      ? (data.status === "Active" || data.status === "Approved" || data.isApproved === true)
      : true,
    avatar:   data.avatar || data.profileImage || `https://i.pravatar.cc/150?u=${data.email}`,
    token:    data.token,
  };
}
export async function registerUser(newUser) {
  const res = await api.post("/Auth/register", {
    fullName: newUser.name,
    email:    newUser.email,
    password: newUser.password,
    phone:    newUser.phone || "0000000000",
    role:     ROLE_MAP[newUser.role] ?? 3,
  });

  const data = res.data?.data || res.data;

  return {
    id:       data.id       || data.userId || null,
    name:     data.fullName || data.name   || newUser.name,
    email:    data.email    || newUser.email,
    role:     normalizeRole(data.role) || newUser.role,
    approved: newUser.role === "provider" ? false : true,
    avatar:   data.avatar   || `https://i.pravatar.cc/150?u=${newUser.email}`,
    token:    data.token    || data.accessToken || null,
  };
}

export async function logoutUser() {
  try {
    await api.post("/Auth/logout");
  } catch {
    localStorage.removeItem("user");
  }
}