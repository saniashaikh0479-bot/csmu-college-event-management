import React from 'react';

const PageBackground = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden ${className}`}>
      {/* Geometric watermark pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        {/* Large circles */}
        <div className="absolute top-20 right-20 w-96 h-96 border-2 border-primary-900 rounded-full" />
        <div className="absolute bottom-40 left-20 w-80 h-80 border-2 border-primary-900 rounded-full" />
        
        {/* Squares and rectangles */}
        <div className="absolute top-60 left-1/4 w-64 h-64 border-2 border-primary-900 rotate-12" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 border-2 border-primary-900 rotate-45" />
        <div className="absolute top-1/3 right-10 w-32 h-32 border-2 border-primary-900" />
        
        {/* Triangles using borders */}
        <div className="absolute bottom-1/3 left-10 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-primary-900 rotate-[-15deg]" />
        <div className="absolute top-1/2 right-1/3 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-primary-900 rotate-[30deg]" />
        
        {/* Small decorative dots */}
        <div className="absolute top-40 left-1/2 w-3 h-3 bg-primary-900 rounded-full" />
        <div className="absolute top-80 right-20 w-2 h-2 bg-primary-900 rounded-full" />
        <div className="absolute bottom-60 left-1/3 w-4 h-4 bg-primary-900 rounded-full" />
        <div className="absolute top-1/4 right-1/2 w-2 h-2 bg-primary-900 rounded-full" />
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-primary-900 rounded-full" />
        
        {/* Lines */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-primary-900 transform rotate-12" />
        <div className="absolute top-0 right-1/4 w-px h-96 bg-primary-900 transform -rotate-6" />
        <div className="absolute bottom-0 left-1/4 w-px h-64 bg-primary-900 transform rotate-45" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
