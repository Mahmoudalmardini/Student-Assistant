import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('AI Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('optimize-route')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRANSPORTATION_SUPERVISOR)
  @ApiOperation({ summary: 'Optimize route using AI algorithms' })
  async optimizeRoute(@Body() routeData: { waypoints: Array<{ latitude: number; longitude: number }> }) {
    return this.aiService.optimizeRoute(routeData.waypoints);
  }

  @Post('predict-arrival')
  @ApiOperation({ summary: 'Predict bus arrival time using AI' })
  async predictArrivalTime(
    @Body()
    predictionData: {
      busId: string;
      routeId: string;
      currentLocation: { latitude: number; longitude: number };
    },
  ) {
    return this.aiService.predictArrivalTime(
      predictionData.busId,
      predictionData.routeId,
      predictionData.currentLocation,
    );
  }

  @Post('student-query')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Process student query using AI chatbot' })
  async processStudentQuery(
    @Body()
    queryData: {
      query: string;
      studentId: string;
    },
  ) {
    return this.aiService.processStudentQuery(queryData.query, queryData.studentId);
  }

  @Post('generate-insights')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRANSPORTATION_SUPERVISOR)
  @ApiOperation({ summary: 'Generate transportation insights using AI analytics' })
  async generateInsights(
    @Body()
    timeRange: {
      start: Date;
      end: Date;
    },
  ) {
    return this.aiService.generateTransportationInsights(timeRange);
  }

  @Post('external-service')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Integrate with external AI services' })
  async integrateExternalService(
    @Body()
    integrationData: {
      serviceType: string;
      data: any;
    },
  ) {
    return this.aiService.integrateExternalAiService(
      integrationData.serviceType,
      integrationData.data,
    );
  }

  @Post('semester-plan')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.COLLEGE_SUPERVISOR,
    UserRole.STUDENT,
  )
  @ApiOperation({ summary: 'Generate a semester plan using rules + n8n workflow' })
  async generateSemesterPlan(
    @Body()
    dto: {
      studentId: string;
      requestedCredits: number;
      semesterId: string;
    },
  ) {
    return this.aiService.generateSemesterPlan(dto);
  }
}
