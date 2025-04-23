import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ChevronLeft, Power, Activity, Users, Package, Clock, Memory, Cpu } from 'lucide-react';
import { useServerStore } from '../../store/serverStore';
import { usePluginStore } from '../../store/pluginStore';
import StatusBadge from '../UI/StatusBadge';
import PageHeader from '../UI/PageHeader';
import { motion } from 'framer-motion';

const ServerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getServerById, loading, restartServer, fetchServers } = useServerStore();
  const { plugins, fetchPlugins } = usePluginStore();
  const [isRestarting, setIsRestarting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const server = getServerById(id || '');
  
  useEffect(() => {
    if (!server) {
      fetchServers();
    }
    fetchPlugins();
  }, [fetchServers, fetchPlugins, server]);
  
  if (!server) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }
  
  const handleRestart = async () => {
    if (window.confirm(`Are you sure you want to restart ${server.name}?`)) {
      setIsRestarting(true);
      await restartServer(server.id);
      setTimeout(() => {
        setIsRestarting(false);
      }, 5000);
    }
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'plugins', label: 'Plugins', icon: Package },
  ];
  
  return (
    <div>
      <PageHeader 
        title={server.name}
        description={`Server details and management for ${server.name}`}
        actions={
          <div className="flex space-x-3">
            <button 
              className="btn btn-secondary inline-flex items-center"
              onClick={() => navigate('/servers')}
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Servers
            </button>
            <button 
              className={`btn inline-flex items-center ${
                server.status === 'offline' 
                  ? 'btn-success' 
                  : server.status === 'restarting'
                    ? 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500'
                    : 'btn-primary'
              }`}
              onClick={handleRestart}
              disabled={isRestarting || server.status === 'restarting'}
            >
              <Power size={16} className={`mr-2 ${isRestarting || server.status === 'restarting' ? 'animate-pulse' : ''}`} />
              {server.status === 'offline' 
                ? 'Start Server' 
                : server.status === 'restarting'
                  ? 'Restarting...'
                  : 'Restart Server'
              }
            </button>
          </div>
        }
      />
      
      {/* Server Status Card */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-5"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
          <div className="flex items-center">
            <StatusBadge status={server.status} className="text-sm px-3 py-1" />
            <span className="ml-2 text-lg font-semibold">
              {server.status === 'online' 
                ? 'Running' 
                : server.status === 'restarting'
                  ? 'Restarting' 
                  : 'Offline'
              }
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-5"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-3">Players</h3>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-primary-500 mr-2" />
            <span className="text-lg font-semibold">
              {server.players} / {server.maxPlayers}
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-5"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-3">Uptime</h3>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-primary-500 mr-2" />
            <span className="text-lg font-semibold">
              {server.uptime}
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm 
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  transition-colors flex items-center
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Server Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Version:</span>
                    <span className="font-medium">{server.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span className="font-medium">{server.ip}:{server.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plugins:</span>
                    <span className="font-medium">{server.plugins}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Usage</h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center text-gray-700">
                        <Cpu className="h-4 w-4 mr-2 text-gray-500" />
                        CPU Usage
                      </span>
                      <span className="font-medium text-gray-900">{server.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${server.cpu}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-2 rounded-full ${
                          server.cpu > 80 ? 'bg-danger-500' : 
                          server.cpu > 50 ? 'bg-warning-500' : 'bg-success-500'
                        }`}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center text-gray-700">
                        <Memory className="h-4 w-4 mr-2 text-gray-500" />
                        Memory Usage
                      </span>
                      <span className="font-medium text-gray-900">{server.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${server.memory}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-2 rounded-full ${
                          server.memory > 80 ? 'bg-danger-500' : 
                          server.memory > 50 ? 'bg-warning-500' : 'bg-success-500'
                        }`}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Server Logs</h3>
              <div className="bg-gray-50 rounded-md p-4 font-mono text-sm text-gray-800 max-h-64 overflow-y-auto">
                <p>[10:15:32] [Server thread/INFO]: Starting Minecraft server version {server.version}</p>
                <p>[10:15:33] [Server thread/INFO]: Loading properties</p>
                <p>[10:15:34] [Server thread/INFO]: Default game type: SURVIVAL</p>
                <p>[10:15:35] [Server thread/INFO]: Starting Minecraft server on {server.ip}:{server.port}</p>
                <p>[10:15:38] [Server thread/INFO]: Preparing level "world"</p>
                <p>[10:15:45] [Server thread/INFO]: Preparing start region for dimension minecraft:overworld</p>
                <p>[10:15:50] [Server thread/INFO]: Done! For help, type "help"</p>
                <p>[10:16:02] [Server thread/INFO]: Player1 joined the game</p>
                <p>[10:18:15] [Server thread/INFO]: Player2 joined the game</p>
                <p>[10:20:37] [Server thread/INFO]: Player1 lost connection: Disconnected</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'players' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Players ({server.players}/{server.maxPlayers})</h3>
            
            {server.players === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No players are currently connected to this server</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Connected
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                            P
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Player2
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        192.168.1.43
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        2h 15m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          Message
                        </button>
                        <button className="text-danger-600 hover:text-danger-900">
                          Kick
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'plugins' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Server Plugins ({plugins.length})</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dependencies
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plugins.map((plugin, index) => (
                    <motion.tr 
                      key={plugin.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {plugin.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {plugin.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plugin.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={plugin.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plugin.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plugin.dependencies.length > 0 
                          ? plugin.dependencies.join(', ') 
                          : 'None'
                        }
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerDetail;