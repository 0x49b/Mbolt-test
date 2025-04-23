import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Server, Users, Package, Activity } from 'lucide-react';
import { useWebSocketStore } from '../../store/websocketStore';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const wsStatus = useWebSocketStore(state => state.status);
  
  const connectionStatusClass = wsStatus === 'connected'
    ? 'bg-success-500'
    : wsStatus === 'connecting'
      ? 'bg-warning-500 animate-pulse'
      : 'bg-danger-500';
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Activity },
    { to: '/servers', label: 'Servers', icon: Server },
    { to: '/players', label: 'Players', icon: Users },
    { to: '/plugins', label: 'Plugins', icon: Package }
  ];
  
  return (
    <nav className="bg-primary-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Server className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">ServerAdmin</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`${
                      isActive(link.to)
                        ? 'border-white text-white'
                        : 'border-transparent text-primary-100 hover:border-primary-300 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <span className={`inline-block h-2 w-2 rounded-full ${connectionStatusClass} mr-2`}></span>
              <span className="text-xs text-white">
                {wsStatus === 'connected' ? 'Connected' : 
                 wsStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            
            <div className="sm:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-primary-800 animate-fade-in" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${
                    isActive(link.to)
                      ? 'bg-primary-600 border-white text-white'
                      : 'border-transparent text-primary-100 hover:bg-primary-600 hover:border-primary-300 hover:text-white'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 flex items-center`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;