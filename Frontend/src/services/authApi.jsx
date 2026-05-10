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
  try {
    const res = await api.post("/Auth/login", { email, password });
    const data = res.data.data;

    const role = normalizeRole(data.role);

    const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
    const userId =
      tokenPayload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    return {
      id: userId || data.id || null,
      name: data.fullName,
      email: data.email,
      role,
      approved:
        role === "provider"
          ? data.status === "Active" || data.status === "Approved"
          : true,
      status: data.status, // 👈 مهم جداً
      token: data.token,
    };
  } catch (err) {
    // 👇 هنا أهم تعديل
    const message = err?.response?.data?.message;

    if (message?.includes("not approved")) {
      // نرجع user object partial بدل ما نكسر اللوجين
      const data = err.response.data.data || {};

      return {
        id: data.id,
        name: data.fullName,
        email,
        role: "provider",
        approved: false,
        status: "Pending",
        token: null,
      };
    }

    throw new Error(message || "Login failed");
  }
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