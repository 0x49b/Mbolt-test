import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, Users, Package, Activity, ChevronRight, AlertTriangle } from 'lucide-react';
import { useServerStore } from '../../store/serverStore';
import { usePlayerStore } from '../../store/playerStore';
import { usePluginStore } from '../../store/pluginStore';
import StatusBadge from '../UI/StatusBadge';
import PageHeader from '../UI/PageHeader';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { servers, fetchServers } = useServerStore();
  const { players, getBannedPlayers, fetchPlayers } = usePlayerStore();
  const { plugins, getEnabledPlugins, fetchPlugins } = usePluginStore();
  
  useEffect(() => {
    fetchServers();
    fetchPlayers();
    fetchPlugins();
  }, [fetchServers, fetchPlayers, fetchPlugins]);
  
  const onlineServers = servers.filter(server => server.status === 'online').length;
  const totalPlayers = players.length;
  const bannedPlayers = getBannedPlayers().length;
  const enabledPlugins = getEnabledPlugins().length;
  
  // Find servers with high resource usage (CPU or Memory > 80%)
  const highResourceServers = servers.filter(
    server => server.cpu > 80 || server.memory > 80
  );
  
  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your server infrastructure"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <Server className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Servers</h2>
              <p className="text-2xl font-semibold text-gray-900">{onlineServers}/{servers.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/servers" className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center">
              View all servers
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Players</h2>
              <p className="text-2xl font-semibold text-gray-900">{totalPlayers}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/players" className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center">
              View all players
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-warning-100 text-warning-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Banned Players</h2>
              <p className="text-2xl font-semibold text-gray-900">{bannedPlayers}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/players/banned" className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center">
              View banned players
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100 text-success-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Plugins</h2>
              <p className="text-2xl font-semibold text-gray-900">{enabledPlugins}/{plugins.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/plugins" className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center">
              View all plugins
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Server Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Server Status</h3>
          </div>
          <div className="p-6">
            {servers.length === 0 ? (
              <div className="text-center py-6">
                <Server className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No servers available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {servers.map((server, index) => (
                  <div key={server.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusBadge status={server.status} />
                      <span className="ml-3 font-medium">{server.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {server.players}/{server.maxPlayers} players
                      </div>
                      <Link 
                        to={`/servers/${server.id}`}
                        className="text-primary-600 hover:text-primary-900 text-sm flex items-center"
                      >
                        Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Resource Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Resource Alerts</h3>
          </div>
          <div className="p-6">
            {highResourceServers.length === 0 ? (
              <div className="text-center py-6">
                <Activity className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No resource alerts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {highResourceServers.map(server => (
                  <div key={server.id} className="p-4 bg-danger-50 rounded-md border border-danger-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-danger-800">{server.name}</div>
                      <Link 
                        to={`/servers/${server.id}`}
                        className="text-primary-600 hover:text-primary-900 text-sm flex items-center"
                      >
                        View Details
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {server.cpu > 80 && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-danger-600">High CPU Usage</div>
                          <div className="text-sm font-medium text-danger-700">{server.cpu}%</div>
                        </div>
                      )}
                      {server.memory > 80 && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-danger-600">High Memory Usage</div>
                          <div className="text-sm font-medium text-danger-700">{server.memory}%</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Recent Bans */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Bans</h3>
          </div>
          <div className="p-6">
            {bannedPlayers === 0 ? (
              <div className="text-center py-6">
                <AlertTriangle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No banned players</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getBannedPlayers().slice(0, 3).map(player => (
                  <div key={player.id} className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{player.username}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Reason: {player.banReason}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Banned at: {new Date(player.bannedAt || '').toLocaleString()}
                      </div>
                    </div>
                    <StatusBadge status="banned" />
                  </div>
                ))}
                
                {bannedPlayers > 3 && (
                  <div className="pt-2 border-t border-gray-200">
                    <Link to="/players/banned" className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center">
                      View all banned players
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Active Plugins */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Plugin Status</h3>
          </div>
          <div className="p-6">
            {plugins.length === 0 ? (
              <div className="text-center py-6">
                <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No plugins available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {plugins.slice(0, 5).map(plugin => (
                  <div key={plugin.id} className="flex items-center justify-between">
                    <div className="font-medium">{plugin.name}</div>
                    <StatusBadge status={plugin.status} />
                  </div>
                ))}
                
                {plugins.length > 5 && (
                  <div className="pt-2 border-t border-gray-200">
                    <Link to="/plugins" className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center">
                      View all plugins
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;