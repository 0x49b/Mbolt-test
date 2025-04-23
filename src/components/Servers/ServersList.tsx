import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Search, ServerCrash } from 'lucide-react';
import { useServerStore } from '../../store/serverStore';
import StatusBadge from '../UI/StatusBadge';
import PageHeader from '../UI/PageHeader';
import { motion } from 'framer-motion';

const ServersList: React.FC = () => {
  const { servers, loading, fetchServers, setSelectedServer } = useServerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);
  
  // Filter servers based on search term
  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.ip.includes(searchTerm)
  );
  
  const handleServerClick = (serverId: string) => {
    setSelectedServer(serverId);
    navigate(`/servers/${serverId}`);
  };
  
  return (
    <div>
      <PageHeader 
        title="Servers" 
        description="Manage and monitor your game servers"
        actions={
          <button 
            className="btn btn-secondary inline-flex items-center"
            onClick={() => fetchServers()}
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search servers by name or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Servers grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 p-6 text-center bg-white rounded-lg shadow-sm">
          <ServerCrash className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No servers found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "No servers match your search criteria." 
              : "There are no servers to display."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleServerClick(server.id)}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{server.name}</h3>
                  <StatusBadge status={server.status} />
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>Version:</span>
                    <span className="font-medium">{server.version}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Players:</span>
                    <span className="font-medium">{server.players} / {server.maxPlayers}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Uptime:</span>
                    <span className="font-medium">{server.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Address:</span>
                    <span className="font-medium">{server.ip}:{server.port}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">CPU Usage</span>
                        <span className="text-xs font-medium text-gray-700">{server.cpu}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            server.cpu > 80 ? 'bg-danger-500' : 
                            server.cpu > 50 ? 'bg-warning-500' : 'bg-success-500'
                          }`} 
                          style={{ width: `${server.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Memory Usage</span>
                        <span className="text-xs font-medium text-gray-700">{server.memory}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            server.memory > 80 ? 'bg-danger-500' : 
                            server.memory > 50 ? 'bg-warning-500' : 'bg-success-500'
                          }`} 
                          style={{ width: `${server.memory}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServersList;