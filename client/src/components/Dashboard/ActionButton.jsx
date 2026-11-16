const ActionButton = ({ icon, label, color, onClick }) => {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm transition ${color}`}
    >
      <Icon size={18} aria-hidden="true" /> {label}
    </button>
  );
};

export default ActionButton;
