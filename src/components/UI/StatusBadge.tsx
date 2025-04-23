import React from 'react';

type StatusType = 'online' | 'offline' | 'banned' | 'restarting' | 'enabled' | 'disabled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeClass = '';
  
  switch (status) {
    case 'online':
    case 'enabled':
      badgeClass = 'bg-success-100 text-success-700';
      break;
    case 'offline':
    case 'disabled':
      badgeClass = 'bg-gray-100 text-gray-600';
      break;
    case 'banned':
      badgeClass = 'bg-danger-100 text-danger-700';
      break;
    case 'restarting':
      badgeClass = 'bg-warning-100 text-warning-700 animate-pulse';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-600';
  }
  
  return (
    <span className={`badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass} ${className}`}>
      <span className={`w-2 h-2 mr-1.5 rounded-full ${status === 'online' || status === 'enabled' ? 'bg-success-500' : 
        status === 'restarting' ? 'bg-warning-500' : 
        status === 'banned' ? 'bg-danger-500' : 'bg-gray-500'}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;