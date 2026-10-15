// File: components/GlassCard.js
'use client';

const GlassCard = ({ children, className = '', hover3d = false }) => {
  return (
    <div
      className={`glass dark:glass mx-glass-hover p-6 rounded-lg transition-all duration-300 ${
        hover3d ? 'card-3d hover:shadow-2xl hover:shadow-primary/20' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;