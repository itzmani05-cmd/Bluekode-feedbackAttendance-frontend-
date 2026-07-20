const Card = ({ title, actions, children, className = '' }) => (
  <div className={`card p-4 sm:p-5 ${className}`}>
    {(title || actions) && (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
        {actions}
      </div>
    )}
    {children}
  </div>
);

export default Card;
