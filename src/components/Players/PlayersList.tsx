import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, UserX } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import StatusBadge from '../UI/StatusBadge';
import PageHeader from '../UI/PageHeader';
import BanPlayerModal from './BanPlayerModal';
import { Player } from '../../types';
import { motion } from 'framer-motion';

const PlayersList: React.FC = () => {
  const { players, loading, fetchPlayers } = usePlayerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Filter players based on search term
  const filteredPlayers = players.filter(player => 
    player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.ipAddress.includes(searchTerm)
  );

  const handleBanClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsBanModalOpen(true);
  };

  const handleBanModalClose = () => {
    setSelectedPlayer(null);
    setIsBanModalOpen(false);
  };

  return (
    <div>
      <PageHeader 
        title="Players" 
        description="Manage players connected to your servers"
        actions={
          <button 
            className="btn btn-secondary inline-flex items-center"
            onClick={() => fetchPlayers()}
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
            placeholder="Search players by name or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Players table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 p-6 text-center">
            <UserX className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No players found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? "No players match your search criteria." 
                : "There are no players to display."}
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
                    IP Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player, index) => (
                  <motion.tr 
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {player.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={player.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(player.lastSeen).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {player.status === 'banned' ? (
                        <button
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          onClick={() => alert(`Ban reason: ${player.banReason}`)}
                        >
                          View Ban
                        </button>
                      ) : (
                        <button
                          className="text-danger-600 hover:text-danger-900 mr-3"
                          onClick={() => handleBanClick(player)}
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Ban Player Modal */}
      {selectedPlayer && (
        <BanPlayerModal
          isOpen={isBanModalOpen}
          onClose={handleBanModalClose}
          player={selectedPlayer}
        />
      )}
    </div>
  );
};

export default PlayersList;