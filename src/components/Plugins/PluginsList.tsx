import React, { useEffect, useState } from 'react';
import { RefreshCw, Search, Package, Filter } from 'lucide-react';
import { usePluginStore } from '../../store/pluginStore';
import StatusBadge from '../UI/StatusBadge';
import PageHeader from '../UI/PageHeader';
import { motion } from 'framer-motion';

const PluginsList: React.FC = () => {
  const { plugins, loading, fetchPlugins, togglePluginStatus } = usePluginStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  
  useEffect(() => {
    fetchPlugins();
  }, [fetchPlugins]);
  
  // Filter plugins based on search term and status filter
  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = 
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'enabled' && plugin.status === 'enabled') ||
      (statusFilter === 'disabled' && plugin.status === 'disabled');
    
    return matchesSearch && matchesStatus;
  });
  
  const handleToggleStatus = async (pluginId: string) => {
    await togglePluginStatus(pluginId);
  };
  
  return (
    <div>
      <PageHeader 
        title="Plugins" 
        description="Manage and configure server plugins"
        actions={
          <button 
            className="btn btn-secondary inline-flex items-center"
            onClick={() => fetchPlugins()}
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search plugins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="input pl-10 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'enabled' | 'disabled')}
          >
            <option value="all">All Plugins</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>
      
      {/* Plugins table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : filteredPlugins.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No plugins found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? "No plugins match your search or filter criteria." 
                : "There are no plugins to display."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plugin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlugins.map((plugin, index) => (
                  <motion.tr 
                    key={plugin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                          {plugin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {plugin.name}
                          </div>
                          <div className="text-sm text-gray-500 max-w-md">
                            {plugin.description}
                          </div>
                          {plugin.dependencies.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1">
                              Dependencies: {plugin.dependencies.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plugin.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plugin.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={plugin.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className={`${
                          plugin.status === 'enabled'
                            ? 'text-gray-600 hover:text-gray-900'
                            : 'text-primary-600 hover:text-primary-900'
                        } mr-3`}
                        onClick={() => handleToggleStatus(plugin.id)}
                      >
                        {plugin.status === 'enabled' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Configure
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginsList;