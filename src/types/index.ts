export interface Player {
  id: string;
  username: string;
  ipAddress: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'banned';
  banReason?: string;
  bannedAt?: string;
}

export interface Server {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'restarting';
  ip: string;
  port: number;
  players: number;
  maxPlayers: number;
  uptime: string;
  version: string;
  cpu: number;
  memory: number;
  plugins: number;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  status: 'enabled' | 'disabled';
  description: string;
  dependencies: string[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface WebSocketMessage {
  type: 'player' | 'server' | 'plugin' | 'connection';
  action: 'update' | 'add' | 'remove' | 'status';
  data: any;
}