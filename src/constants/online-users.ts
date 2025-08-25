export interface OnlineUsersData {
  authenticated: any[];
  anonymous: any[];
  stats: {
    total: number;
    authenticated: number;
    anonymous: number;
  };
}

export interface OnlineUsersResponse {
  data: OnlineUsersData;
}


export const WEBSOCKET_CONFIG = {
  REFETCH_INTERVAL: 30000, 
} as const;
