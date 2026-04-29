import React from 'react';

const Select = ({ label, error, options, children, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options
          ? options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))
          : children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
