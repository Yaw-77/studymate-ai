import React from 'react';

const Card = ({ children, className = '', padding = 'md' }) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0',
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;