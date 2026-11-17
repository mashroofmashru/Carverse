const colors = {
  blue: "bg-brand text-ink",
  green: "bg-green-100 text-green-700",
  purple: "bg-neutral-100 text-ink",
  red: "bg-red-100 text-red-700",
};

const StatCard = ({ title, value, icon, trend, color = "blue" }) => {
  const Icon = icon;
  return (
    <div className="card p-6 transition hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={24} aria-hidden="true" />
        </div>
        {trend && (
          <span className={`badge ${color === "red" ? "badge-danger" : "badge-success"}`}>{trend}</span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-ink mt-1 break-words">{value}</p>
    </div>
  );
};

export default StatCard;
