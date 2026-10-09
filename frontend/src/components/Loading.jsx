import React from 'react';

const Loading = ({ size = 'md', text = null, fullScreen = false }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className={`${sizes[size]} border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        {spinner}
        {text && <p className="mt-4 text-slate-600 font-medium">{text}</p>}
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex flex-col items-center gap-3">
        {spinner}
        <p className="text-slate-600 text-sm font-medium">{text}</p>
      </div>
    );
  }

  return spinner;
};

export default Loading;