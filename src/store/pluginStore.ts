import { create } from 'zustand';
import { Plugin } from '../types';
import { useWebSocketStore } from './websocketStore';

interface PluginState {
  plugins: Plugin[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPlugins: () => Promise<void>;
  togglePluginStatus: (pluginId: string) => Promise<void>;
  
  // Selectors
  getPluginById: (id: string) => Plugin | undefined;
  getEnabledPlugins: () => Plugin[];
  getDisabledPlugins: () => Plugin[];
}

// Mock data for initial state
const mockPlugins: Plugin[] = [
  {
    id: '1',
    name: 'EssentialsX',
    version: '2.19.4',
    author: 'EssentialsX Team',
    status: 'enabled',
    description: 'Essential server features for Minecraft servers',
    dependencies: []
  },
  {
    id: '2',
    name: 'WorldEdit',
    version: '7.2.10',
    author: 'EngineHub',
    status: 'enabled',
    description: 'In-game map editor for Minecraft',
    dependencies: []
  },
  {
    id: '3',
    name: 'WorldGuard',
    version: '7.0.7',
    author: 'EngineHub',
    status: 'enabled',
    description: 'World protection plugin',
    dependencies: ['WorldEdit']
  },
  {
    id: '4',
    name: 'Vault',
    version: '1.7.3',
    author: 'Milkbowl',
    status: 'enabled',
    description: 'Permissions, chat, and economy API',
    dependencies: []
  },
  {
    id: '5',
    name: 'LuckPerms',
    version: '5.4.40',
    author: 'Luck',
    status: 'enabled',
    description: 'Permission management system',
    dependencies: ['Vault']
  },
  {
    id: '6',
    name: 'CustomPlugin',
    version: '1.0.0',
    author: 'Admin',
    status: 'disabled',
    description: 'Custom server plugin in development',
    dependencies: ['Vault']
  }
];

export const usePluginStore = create<PluginState>((set, get) => ({
  plugins: mockPlugins,
  loading: false,
  error: null,
  
  fetchPlugins: async () => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ plugins: mockPlugins, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plugins', 
        loading: false 
      });
    }
  },
  
  togglePluginStatus: async (pluginId: string) => {
    set({ loading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just update our local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        plugins: state.plugins.map(plugin => 
          plugin.id === pluginId
            ? { 
                ...plugin, 
                status: plugin.status === 'enabled' ? 'disabled' : 'enabled' 
              }
            : plugin
        ),
        loading: false
      }));
      
      // Send WebSocket message to notify about plugin status change
      const updatedPlugin = get().plugins.find(p => p.id === pluginId);
      if (updatedPlugin) {
        useWebSocketStore.getState().sendMessage({
          type: 'plugin',
          action: 'update',
          data: {
            id: pluginId,
            status: updatedPlugin.status
          }
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to toggle plugin status', 
        loading: false 
      });
    }
  },
  
  // Selectors
  getPluginById: (id: string) => {
    return get().plugins.find(plugin => plugin.id === id);
  },
  
  getEnabledPlugins: () => {
    return get().plugins.filter(plugin => plugin.status === 'enabled');
  },
  
  getDisabledPlugins: () => {
    return get().plugins.filter(plugin => plugin.status === 'disabled');
  }
}));

// Subscribe to WebSocket messages
useWebSocketStore.subscribe((state) => {
  const { lastMessage } = state;
  
  if (lastMessage && lastMessage.type === 'plugin') {
    const { action, data } = lastMessage;
    
    if (action === 'update') {
      usePluginStore.setState((state) => ({
        plugins: state.plugins.map(plugin => 
          plugin.id === data.id ? { ...plugin, ...data } : plugin
        )
      }));
    } else if (action === 'add') {
      usePluginStore.setState((state) => ({
        plugins: [...state.plugins, data]
      }));
    } else if (action === 'remove') {
      usePluginStore.setState((state) => ({
        plugins: state.plugins.filter(plugin => plugin.id !== data.id)
      }));
    }
  }
});