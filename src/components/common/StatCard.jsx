const StatCard = ({ label, value, icon: Icon, accent = 'bg-primary-50 text-primary-600' }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default StatCard;
