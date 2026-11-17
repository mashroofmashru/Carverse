const ActionButton = ({ icon, label, color, onClick }) => {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center gap-2 p-3 rounded-lg font-semibold text-sm transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${color}`}
    >
      <Icon size={18} aria-hidden="true" /> {label}
    </button>
  );
};

export default ActionButton;
