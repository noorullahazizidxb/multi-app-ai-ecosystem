import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export interface AdminEvent {
  type: 'QUOTA_HIT' | 'COPILOT_SUBSCRIBED' | 'AI_LATENCY_MS' | 'ACTIVE_USERS' | 'MAINTENANCE_TOGGLE';
  appId: string;
  userId?: string;
  data: Record<string, unknown>;
  timestamp: string;
}

@WebSocketGateway({
  namespace: '/admin-ws',
  cors: { origin: '*' },
})
export class AdminWsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AdminWsGateway.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  afterInit() {
    this.logger.log('Admin WebSocket Gateway initialized on /admin-ws');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Admin client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Admin client disconnected: ${client.id}`);
  }

  /**
   * Broadcast an admin event to all connected admin dashboard clients.
   */
  broadcastEvent(event: AdminEvent): void {
    this.server.emit('admin:event', event);
  }

  /**
   * Handle quota override command from admin.
   */
  @SubscribeMessage('admin:override-quota')
  async handleQuotaOverride(
    client: Socket,
    payload: { userId: string; featureKey: string; newLimit: number },
  ) {
    const key = `quota:override:${payload.userId}:${payload.featureKey}`;
    await this.redis.set(key, payload.newLimit.toString());
    this.logger.log(
      `Quota override: user=${payload.userId} feature=${payload.featureKey} limit=${payload.newLimit}`,
    );
    this.broadcastEvent({
      type: 'QUOTA_HIT',
      appId: process.env.APP_ID || 'unknown',
      userId: payload.userId,
      data: { action: 'override', newLimit: payload.newLimit },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle maintenance mode toggle from admin.
   */
  @SubscribeMessage('admin:toggle-maintenance')
  async handleMaintenanceToggle(
    client: Socket,
    payload: { enabled: boolean },
  ) {
    await this.redis.set('system:maintenance', payload.enabled ? '1' : '0');
    this.logger.warn(`Maintenance mode ${payload.enabled ? 'ENABLED' : 'DISABLED'}`);
    this.broadcastEvent({
      type: 'MAINTENANCE_TOGGLE',
      appId: process.env.APP_ID || 'unknown',
      data: { enabled: payload.enabled },
      timestamp: new Date().toISOString(),
    });
  }
}
