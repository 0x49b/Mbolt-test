import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useWebSocketStore } from '../../store/websocketStore';

const Layout: React.FC = () => {
  const { connect, status } = useWebSocketStore();
  
  // Connect to WebSocket when component mounts
  useEffect(() => {
    if (status === 'disconnected') {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      // Note: We're not disconnecting on unmount because we want to keep
      // the WebSocket connection alive while the app is running
    };
  }, [connect, status]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:px-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ServerAdmin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;