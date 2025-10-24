import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly trackingService: TrackingService) {}

  @SubscribeMessage('join_bus_tracking')
  async handleJoinBusTracking(
    @MessageBody() data: { busId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`bus_${data.busId}`);
    client.emit('joined_bus_tracking', { busId: data.busId });
  }

  @SubscribeMessage('leave_bus_tracking')
  async handleLeaveBusTracking(
    @MessageBody() data: { busId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`bus_${data.busId}`);
    client.emit('left_bus_tracking', { busId: data.busId });
  }

  @SubscribeMessage('update_bus_location')
  async handleUpdateBusLocation(
    @MessageBody()
    data: {
      busId: string;
      latitude: number;
      longitude: number;
      speed?: number;
      heading?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const location = await this.trackingService.updateBusLocation(
        data.busId,
        data.latitude,
        data.longitude,
        data.speed,
        data.heading,
      );

      // Broadcast location update to all clients tracking this bus
      this.server.to(`bus_${data.busId}`).emit('bus_location_updated', {
        busId: data.busId,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          heading: data.heading,
          timestamp: location.createdAt,
        },
      });

      return { success: true, location };
    } catch (error) {
      client.emit('error', { message: 'Failed to update bus location' });
      return { success: false, error: error.message };
    }
  }

  // Method to broadcast location updates (called by external services)
  broadcastBusLocationUpdate(busId: string, locationData: any) {
    this.server.to(`bus_${busId}`).emit('bus_location_updated', {
      busId,
      location: locationData,
    });
  }
}
