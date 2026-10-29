import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/fitness-live',
  cors: { origin: '*' },
})
export class FitnessLiveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(FitnessLiveGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Fitness live athlete connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Fitness live athlete disconnected: ${client.id}`);
  }

  @SubscribeMessage('workout:set-completed')
  handleSetCompleted(
    client: Socket,
    payload: { exercise: string; weightKg: number; reps: number; rpe: number },
  ) {
    this.logger.log(`Set completed by ${client.id}: ${payload.exercise} ${payload.reps} reps`);
    // Broadcast to trainer dashboard under 50ms latency
    client.broadcast.emit('trainer:live-set', {
      athleteId: client.id,
      ...payload,
      timestamp: Date.now(),
    });
    return { status: 'acknowledged' };
  }
}

