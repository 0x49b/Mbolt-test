import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ServersList from './components/Servers/ServersList';
import ServerDetail from './components/Servers/ServerDetail';
import PlayersList from './components/Players/PlayersList';
import BannedPlayersList from './components/Players/BannedPlayersList';
import PluginsList from './components/Plugins/PluginsList';
import { useWebSocketStore } from './store/websocketStore';

function App() {
  const { connect, status } = useWebSocketStore();
  
  // Connect to WebSocket when the app starts
  useEffect(() => {
    if (status === 'disconnected') {
      connect();
    }
    
    // Set page title
    document.title = 'ServerAdmin | Game Server Management';
    
    // Clean up on unmount
    return () => {
      // No cleanup needed here since we're keeping the connection even on unmount
    };
  }, [connect, status]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="servers" element={<ServersList />} />
          <Route path="servers/:id" element={<ServerDetail />} />
          <Route path="players" element={<PlayersList />} />
          <Route path="players/banned" element={<BannedPlayersList />} />
          <Route path="plugins" element={<PluginsList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;