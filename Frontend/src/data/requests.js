const stored = JSON.parse(localStorage.getItem("requests")) || [];

export const requests = stored.length ? stored : [
  {
    id: "r1",
    serviceId: "s1",
    clientId: "u1",
    providerId: "u3",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r2",
    serviceId: "s2",
    clientId: "u1",
    providerId: "u3",
    status: "accepted",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r3",
    serviceId: "s3",
    clientId: "u1",
    providerId: "u3",
    status: "completed",
    createdAt: new Date().toISOString(),
  },
];

export const getRequests = () => requests;

export const addRequest = ({ serviceId, clientId, providerId }) => {
  const newRequest = {
    id: Date.now().toString(),
    serviceId,
    clientId,
    providerId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  localStorage.setItem("requests", JSON.stringify(requests));
  return newRequest;
};
