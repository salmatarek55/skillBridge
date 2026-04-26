const stored = JSON.parse(localStorage.getItem("requests")) || [];
export const requests = stored.length
  ? stored:[
  {
    id: "r1",
    serviceId: "s1",
    clientId: "u1",
    providerId: "u2",
    status: "pending",
    createdAt: new Date().toISOString(),
  }
];

//get all requests
export const getRequests = () => {
  return requests;
};

// add request
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
console.log(requests);
