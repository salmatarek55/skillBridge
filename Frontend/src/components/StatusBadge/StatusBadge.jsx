import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineSparkles,
  HiOutlineCheckBadge,
  HiOutlineMinus,
} from "react-icons/hi2";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: HiOutlineClock,
  },
  accepted: {
    label: "Accepted",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    icon: HiOutlineCheckCircle,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: HiOutlineXCircle,
  },
  completed: {
    label: "Completed",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    icon: HiOutlineSparkles,
  },
  approved: {
    label: "Approved",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    icon: HiOutlineCheckBadge,
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
    icon: HiOutlineMinus,
  };

  const Icon = config.icon;

  const padding =
    size === "md" ? "px-3 py-1.5 text-xs" : "px-2.5 py-0.5 text-[10px]";

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${padding}`}>
      <Icon className="text-sm" />
      {config.label}
    </span>
  );
}
