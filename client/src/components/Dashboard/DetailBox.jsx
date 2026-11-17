const DetailBox = ({ label, value }) => (
  <div className="bg-mist p-3 rounded-lg border border-neutral-200">
    <p className="text-xs font-semibold text-gray-600">{label}</p>
    <p className="text-sm font-semibold text-ink">{value}</p>
  </div>
);

export default DetailBox;
