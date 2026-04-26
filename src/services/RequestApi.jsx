
import { addRequest , getRequests , requests } from "../data/requests";
export const createRequest = async ({ serviceId, clientId, providerId }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = getRequests().find(
        (r) =>
          r.serviceId === serviceId &&
          r.clientId === clientId
      );

      if (exists) {
        reject({ message: "You already requested this service" });
        return;
      }

      const newRequest = addRequest({
        serviceId,
        clientId,
        providerId,
      });

      resolve(newRequest);
    }, 700);
  });
};

export const cancelRequest = (requestId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = requests.findIndex((r) => r.id === requestId);
      if (index === -1) {
        reject({ message: "Request not found" });
        return;
      }
      requests.splice(index, 1);
      localStorage.setItem("requests", JSON.stringify(requests));
      resolve({ success: true });
    }, 300);
  });
};
