import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ label, error, className = '', helperText, id, required, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        required={required}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
      {helperText && !error && <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  helperText: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

Input.defaultProps = {
  className: '',
  required: false,
  type: 'text'
};

export default Input;
