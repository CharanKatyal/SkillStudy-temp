import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-850/80 border border-slate-800/80 rounded-2xl p-5 ${
        hoverable ? 'hover:border-slate-700 hover:bg-slate-800/90 transition cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
