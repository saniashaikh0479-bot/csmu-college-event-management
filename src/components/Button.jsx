import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', size = 'md', className = '', 'aria-label': ariaLabel, ...props }) => {
  const baseStyles = 'font-medium border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-700 hover:bg-primary-800 text-white border-primary-700',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={props.disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  'aria-label': PropTypes.string,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  className: '',
  disabled: false
};

export default Button;
