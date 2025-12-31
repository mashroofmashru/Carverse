import {
  ShieldAlert,
  UserPlus,
  FileSearch,
} from "lucide-react";

const ActionButton = ({ icon: Icon, label, color }) => (
  <button className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm transition ${color}`}>
    <Icon size={18} /> {label}
  </button>
);

export default ActionButton;