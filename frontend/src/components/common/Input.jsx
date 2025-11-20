import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : ''} px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-400 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;