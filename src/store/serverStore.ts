import { create } from 'zustand';
import { Server } from '../types';
import { useWebSocketStore } from './websocketStore';

interface ServerState {
  servers: Server[];
  selectedServerId: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchServers: () => Promise<void>;
  setSelectedServer: (serverId: string | null) => void;
  restartServer: (serverId: string) => Promise<void>;
  
  // Selectors
  getServerById: (id: string) => Server | undefined;
  getSelectedServer: () => Server | undefined;
}

// Mock data for initial state
const mockServers: Server[] = [
  {
    id: '1',
    name: 'Production Server',
    status: 'online',
    ip: '192.168.1.100',
    port: 25565,
    players: 42,
    maxPlayers: 100,
    uptime: '3d 6h 42m',
    version: '1.18.2',
    cpu: 35,
    memory: 62,
    plugins: 15
  },
  {
    id: '2',
    name: 'Test Server',
    status: 'online',
    ip: '192.168.1.101',
    port: 25565,
    players: 5,
    maxPlayers: 20,
    uptime: '1d 2h 15m',
    version: '1.19.0',
    cpu: 15,
    memory: 30,
    plugins: 8
  },
  {
    id: '3',
    name: 'Development Server',
    status: 'offline',
    ip: '192.168.1.102',
    port: 25565,
    players: 0,
    maxPlayers: 10,
    uptime: '0d 0h 0m',
    version: '1.19.1',
    cpu: 0,
    memory: 0,
    plugins: 20
  }
];

export const useServerStore = create<ServerState>((set, get) => ({
  servers: mockServers,
  selectedServerId: null,
  loading: false,
  error: null,
  
  fetchServers: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ servers: mockServers, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch servers', 
        loading: false 
      });
    }
  },
  
  setSelectedServer: (serverId: string | null) => {
    set({ selectedServerId: serverId });
  },
  
  restartServer: async (serverId: string) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just update our local state
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      set(state => ({
        servers: state.servers.map(server => 
          server.id === serverId
            ? { ...server, status: 'restarting' }
            : server
        ),
        loading: false
      }));
      
      // Simulate server restart process
      setTimeout(() => {
        set(state => ({
          servers: state.servers.map(server => 
            server.id === serverId
              ? { ...server, status: 'online', uptime: '0d 0h 1m' }
              : server
          )
        }));
      }, 5000);
      
      // Send WebSocket message to notify about server restart
      useWebSocketStore.getState().sendMessage({
        type: 'server',
        action: 'update',
        data: {
          id: serverId,
          status: 'restarting'
        }
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to restart server', 
        loading: false 
      });
    }
  },
  
  // Selectors
  getServerById: (id: string) => {
    return get().servers.find(server => server.id === id);
  },
  
  getSelectedServer: () => {
    const { servers, selectedServerId } = get();
    if (!selectedServerId) return undefined;
    return servers.find(server => server.id === selectedServerId);
  }
}));

// Subscribe to WebSocket messages
useWebSocketStore.subscribe((state) => {
  const { lastMessage } = state;
  
  if (lastMessage && lastMessage.type === 'server') {
    const { action, data } = lastMessage;
    
    if (action === 'update') {
      useServerStore.setState((state) => ({
        servers: state.servers.map(server => 
          server.id === data.id ? { ...server, ...data } : server
        )
      }));
    } else if (action === 'add') {
      useServerStore.setState((state) => ({
        servers: [...state.servers, data]
      }));
    } else if (action === 'remove') {
      useServerStore.setState((state) => ({
        servers: state.servers.filter(server => server.id !== data.id)
      }));
    }
  }
});