import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "../../services/ServiceApi";
import ServiceCard from "../../components/ServiceCard/ServiceCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

export default function Services() {
  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError)
    return <p className="text-center text-red-500">Error loading data</p>;
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 ">
        <h1 className="text-2xl font-bold mb-6 text-center">
        Explore Services
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.serviceId} service={service} />
        ))}
      </div>
      </div>
    </>
  );
}
