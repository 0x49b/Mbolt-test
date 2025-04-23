import { create } from 'zustand';
import { Player } from '../types';
import { useWebSocketStore } from './websocketStore';

interface PlayerState {
  players: Player[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPlayers: () => Promise<void>;
  banPlayer: (playerId: string, reason: string) => Promise<void>;
  unbanPlayer: (playerId: string) => Promise<void>;
  
  // Selectors
  getPlayerById: (id: string) => Player | undefined;
  getBannedPlayers: () => Player[];
}

// Mock data for initial state
const mockPlayers: Player[] = [
  {
    id: '1',
    username: 'Player1',
    ipAddress: '192.168.1.1',
    lastSeen: new Date().toISOString(),
    status: 'online'
  },
  {
    id: '2',
    username: 'Player2',
    ipAddress: '192.168.1.2',
    lastSeen: new Date().toISOString(),
    status: 'offline'
  },
  {
    id: '3',
    username: 'BannedPlayer',
    ipAddress: '192.168.1.3',
    lastSeen: new Date().toISOString(),
    status: 'banned',
    banReason: 'Inappropriate behavior',
    bannedAt: new Date().toISOString()
  }
];

export const usePlayerStore = create<PlayerState>((set, get) => ({
  players: mockPlayers,
  loading: false,
  error: null,
  
  fetchPlayers: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ players: mockPlayers, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch players', 
        loading: false 
      });
    }
  },
  
  banPlayer: async (playerId: string, reason: string) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just update our local state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        players: state.players.map(player => 
          player.id === playerId
            ? { 
                ...player, 
                status: 'banned', 
                banReason: reason,
                bannedAt: new Date().toISOString()
              }
            : player
        ),
        loading: false
      }));
      
      // Send WebSocket message to notify about player ban
      useWebSocketStore.getState().sendMessage({
        type: 'player',
        action: 'update',
        data: {
          id: playerId,
          status: 'banned',
          banReason: reason
        }
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to ban player', 
        loading: false 
      });
    }
  },
  
  unbanPlayer: async (playerId: string) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just update our local state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        players: state.players.map(player => 
          player.id === playerId
            ? { 
                ...player, 
                status: 'offline', 
                banReason: undefined,
                bannedAt: undefined
              }
            : player
        ),
        loading: false
      }));
      
      // Send WebSocket message to notify about player unban
      useWebSocketStore.getState().sendMessage({
        type: 'player',
        action: 'update',
        data: {
          id: playerId,
          status: 'offline'
        }
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to unban player', 
        loading: false 
      });
    }
  },
  
  // Selectors
  getPlayerById: (id: string) => {
    return get().players.find(player => player.id === id);
  },
  
  getBannedPlayers: () => {
    return get().players.filter(player => player.status === 'banned');
  }
}));

// Subscribe to WebSocket messages
useWebSocketStore.subscribe((state) => {
  const { lastMessage } = state;
  
  if (lastMessage && lastMessage.type === 'player') {
    const { action, data } = lastMessage;
    
    if (action === 'update') {
      usePlayerStore.setState((state) => ({
        players: state.players.map(player => 
          player.id === data.id ? { ...player, ...data } : player
        )
      }));
    } else if (action === 'add') {
      usePlayerStore.setState((state) => ({
        players: [...state.players, data]
      }));
    } else if (action === 'remove') {
      usePlayerStore.setState((state) => ({
        players: state.players.filter(player => player.id !== data.id)
      }));
    }
  }
});