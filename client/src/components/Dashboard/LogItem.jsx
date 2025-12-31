import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

const LogItem = ({ status, title, user, time }) => {
  const icons = {
    security: <ShieldAlert className="w-5 h-5 text-red-500" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icons[status]}</div>
        <div>
          <p className="text-sm font-bold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">Initiated by: <span className="font-medium text-blue-600">{user}</span></p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase">{time}</span>
    </div>
  );
};

export default LogItem;