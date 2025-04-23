import { create } from 'zustand';
import { WebSocketMessage } from '../types';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketState {
  socket: WebSocket | null;
  status: ConnectionStatus;
  lastMessage: WebSocketMessage | null;
  lastError: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: any) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  status: 'disconnected',
  lastMessage: null,
  lastError: null,
  
  connect: () => {
    // Close existing connection if any
    const { socket } = get();
    if (socket) {
      socket.close();
    }
    
    try {
      set({ status: 'connecting' });
      
      const newSocket = new WebSocket('ws://localhost:3000/ws');
      
      newSocket.onopen = () => {
        set({ socket: newSocket, status: 'connected', lastError: null });
        console.log('WebSocket connection established');
      };
      
      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          set({ lastMessage: message });
          
          // The actual handling of different message types will be done by the subscriber stores
          // (playerStore, serverStore, pluginStore)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      newSocket.onerror = (event) => {
        set({ 
          status: 'error', 
          lastError: 'WebSocket connection error' 
        });
        console.error('WebSocket error:', event);
      };
      
      newSocket.onclose = () => {
        set({ 
          status: 'disconnected', 
          socket: null 
        });
        console.log('WebSocket connection closed');
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          const currentState = get();
          if (currentState.status !== 'connected') {
            get().connect();
          }
        }, 5000);
      };
      
      set({ socket: newSocket });
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      set({ 
        status: 'error', 
        lastError: error instanceof Error ? error.message : 'Unknown WebSocket error'
      });
    }
  },
  
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, status: 'disconnected' });
    }
  },
  
  sendMessage: (message: any) => {
    const { socket, status } = get();
    if (socket && status === 'connected') {
      socket.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }
}));