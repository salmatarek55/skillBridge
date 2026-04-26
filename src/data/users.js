export const users = [
  {
    id: "u1",
    name: "Sara Ahmed",
    email: "client@test.com",
    password: "Client123",
    role: "client",
    approved: true,
    avatar: "https://i.pravatar.cc/150?img=47",
    messages: [],
    requests: []
  },
  {
    id: "u2",
    name: "Sama Sayed",
    email: "client2@test.com",
    password: "Client123",
    role: "client",
    approved: true,
    avatar: "https://i.pravatar.cc/150?img=47",
    messages: [],
    requests: []
  },
  {
    id: "u2",
    name: "Omar Dev",
    email: "provider@test.com",
    password: "Provider123",
    role: "provider",
    approved: false,
    avatar: "https://i.pravatar.cc/150?img=12",
    services: [],
    earnings: 0,
    orders: []
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
    approved: true,
    avatar: "https://i.pravatar.cc/150?img=3",
    permissions: ["users", "services", "approvals"]
  }
];