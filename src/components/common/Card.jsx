const Card = ({ title, actions, children, className = '' }) => (
  <div className={`card p-5 ${className}`}>
    {(title || actions) && (
      <div className="mb-4 flex items-center justify-between">
        {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
        {actions}
      </div>
    )}
    {children}
  </div>
);

export default Card;
