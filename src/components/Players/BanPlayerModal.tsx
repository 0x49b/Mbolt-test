import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Player } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import { motion, AnimatePresence } from 'framer-motion';

interface BanPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
}

const BanPlayerModal: React.FC<BanPlayerModalProps> = ({ 
  isOpen, 
  onClose, 
  player 
}) => {
  const [reason, setReason] = useState('');
  const { banPlayer, loading } = usePlayerStore();
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reason.trim() === '') {
      alert('Please provide a reason for banning this player.');
      return;
    }
    
    await banPlayer(player.id, reason);
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black opacity-50 transition-opacity"
              onClick={onClose}
            ></motion.div>
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Ban Player: {player.username}
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Ban Reason
                      </label>
                      <textarea
                        id="reason"
                        className="input min-h-[100px]"
                        placeholder="Enter reason for banning this player..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-danger"
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Ban Player'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BanPlayerModal;