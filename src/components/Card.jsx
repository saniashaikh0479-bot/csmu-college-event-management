import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return <div className={`p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl ${className}`}>{children}</div>;
};

const CardBody = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = '' }) => {
  return <div className={`p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl ${className}`}>{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool
};

Card.defaultProps = {
  className: '',
  hover: false
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardHeader.defaultProps = {
  className: ''
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardBody.defaultProps = {
  className: ''
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardFooter.defaultProps = {
  className: ''
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
