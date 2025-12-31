const DetailBox = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
    <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </div>
);

export default DetailBox;