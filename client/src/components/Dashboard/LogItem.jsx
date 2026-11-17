import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

const icons = {
  security: { Icon: ShieldAlert, tint: "bg-red-100 text-red-700" },
  success: { Icon: CheckCircle2, tint: "bg-green-100 text-green-700" },
  warning: { Icon: AlertTriangle, tint: "bg-amber-100 text-amber-800" },
};

const LogItem = ({ status, title, user, time }) => {
  const { Icon, tint } = icons[status] || icons.success;
  return (
    <div className="p-4 flex items-center justify-between gap-4 hover:bg-mist transition">
      <div className="flex items-center gap-4 min-w-0">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tint}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{title}</p>
          <p className="text-xs text-gray-600 truncate">
            Initiated by: <span className="font-medium text-ink">{user}</span>
          </p>
        </div>
      </div>
      <span className="shrink-0 text-xs font-medium text-gray-600">{time}</span>
    </div>
  );
};

export default LogItem;
