import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ShieldOff } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import StatusBadge from '../UI/StatusBadge';
import PageHeader from '../UI/PageHeader';
import { motion } from 'framer-motion';

const BannedPlayersList: React.FC = () => {
  const { getBannedPlayers, unbanPlayer, loading } = usePlayerStore();
  const navigate = useNavigate();
  
  const bannedPlayers = getBannedPlayers();
  
  const handleUnban = async (playerId: string) => {
    if (confirm('Are you sure you want to unban this player?')) {
      await unbanPlayer(playerId);
    }
  };
  
  return (
    <div>
      <PageHeader 
        title="Banned Players" 
        description="Manage players who have been banned from your servers"
        actions={
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/players')}
          >
            Back to All Players
          </button>
        }
      />
      
      {/* Banned Players table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : bannedPlayers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 p-6 text-center">
            <ShieldOff className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No banned players</h3>
            <p className="text-gray-500">
              There are currently no banned players.
            </p>
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
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ban Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banned At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bannedPlayers.map((player, index) => (
                  <motion.tr 
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-danger-100 text-danger-700 rounded-full flex items-center justify-center">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {player.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {player.ipAddress}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={player.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.banReason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.bannedAt ? new Date(player.bannedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => handleUnban(player.id)}
                      >
                        Unban
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

export default BannedPlayersList;