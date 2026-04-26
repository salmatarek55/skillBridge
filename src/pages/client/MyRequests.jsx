import React, { useContext ,  useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { services } from "../../data/services";
import { Link } from 'react-router-dom';
import RequestCard from './../../components/RequestCard/RequestCard';
import { getRequests } from "../../data/requests";

export default function MyRequests() {
   const { user } = useContext(AuthContext);
    const [allRequests, setAllRequests] = useState(() => getRequests());
  if (!user) {
    return <p className="text-center mt-10">Please <Link to="/login">login</Link> first ?</p>;
  }
  const myRequests = allRequests.filter((req) => req.clientId === user?.id);

  const handleCancel = (requestId) => {
    setAllRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

    if (myRequests.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p>No requests yet</p>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
      <h1 className="text-xl font-bold text-center mb-4">My Requests</h1>

      {myRequests.map((req) => {
        const service = services.find(
          (s) => s.serviceId === req.serviceId
        );

        return (
          <RequestCard
            key={req.id}
            request={req}
            service={service}
             onCancel={handleCancel}
          />
        );
      })}
    </div>
  );
}
