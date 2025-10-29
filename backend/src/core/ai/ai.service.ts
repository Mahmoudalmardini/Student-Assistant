import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../academic/entities/course.entity';
import { Prerequisite } from '../academic/entities/prerequisite.entity';
import { StudentCourseStatus } from '../academic/entities/student-course-status.entity';
import { ScheduledSection } from '../academic/entities/scheduled-section.entity';
import { PlanningValidator } from '../academic/planning.validator';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private configService: ConfigService,
    private readonly validator: PlanningValidator,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Prerequisite) private readonly prereqRepo: Repository<Prerequisite>,
    @InjectRepository(StudentCourseStatus) private readonly statusRepo: Repository<StudentCourseStatus>,
    @InjectRepository(ScheduledSection) private readonly sectionRepo: Repository<ScheduledSection>,
  ) {}

  // Route optimization using AI algorithms
  async optimizeRoute(waypoints: Array<{ latitude: number; longitude: number }>) {
    this.logger.log('Route optimization requested');
    
    // TODO: Implement AI-based route optimization
    // This could include:
    // - Traffic analysis
    // - Time-based optimization
    // - Distance minimization
    // - Multiple constraint optimization
    
    return {
      optimizedRoute: waypoints,
      estimatedTime: 30,
      estimatedDistance: 15.5,
      confidence: 0.85,
    };
  }

  // Predictive arrival time calculation
  async predictArrivalTime(
    busId: string,
    routeId: string,
    currentLocation: { latitude: number; longitude: number },
  ) {
    this.logger.log(`Predicting arrival time for bus ${busId}`);
    
    // TODO: Implement ML-based arrival time prediction
    // This could include:
    // - Historical data analysis
    // - Traffic pattern recognition
    // - Weather factor consideration
    // - Real-time traffic data integration
    
    return {
      busId,
      estimatedArrivalTime: new Date(Date.now() + 15 * 60000), // 15 minutes from now
      confidence: 0.75,
      factors: ['traffic', 'distance', 'historical_data'],
    };
  }

  // Chatbot/Virtual assistant functionality
  async processStudentQuery(query: string, studentId: string) {
    this.logger.log(`Processing student query: ${query}`);
    
    // TODO: Implement NLP-based query processing
    // This could include:
    // - Intent recognition
    // - Entity extraction
    // - Response generation
    // - Integration with knowledge base
    
    return {
      query,
      response: 'This is a placeholder response. AI chatbot functionality will be implemented here.',
      intent: 'general_inquiry',
      confidence: 0.6,
      suggestedActions: ['check_bus_schedule', 'view_route_map'],
    };
  }

  // Analytics and insights generation
  async generateTransportationInsights(timeRange: { start: Date; end: Date }) {
    this.logger.log('Generating transportation insights');
    
    // TODO: Implement AI-powered analytics
    // This could include:
    // - Usage pattern analysis
    // - Efficiency metrics
    // - Predictive maintenance
    // - Cost optimization suggestions
    
    return {
      timeRange,
      insights: [
        {
          type: 'usage_pattern',
          description: 'Peak usage times identified',
          recommendation: 'Consider adding more buses during 7-9 AM and 4-6 PM',
        },
        {
          type: 'efficiency',
          description: 'Route efficiency analysis',
          recommendation: 'Route A could be optimized to reduce travel time by 15%',
        },
      ],
      confidence: 0.8,
    };
  }

  // Integration with external AI services
  async integrateExternalAiService(serviceType: string, data: any) {
    this.logger.log(`Integrating with external AI service: ${serviceType}`);
    
    // TODO: Implement integration with external AI services
    // Examples:
    // - OpenAI GPT for chatbot functionality
    // - Google Maps API for route optimization
    // - Custom ML models for predictions
    
    switch (serviceType) {
      case 'openai':
        return this.integrateOpenAI(data);
      case 'maps':
        return this.integrateMapsService(data);
      default:
        return { error: 'Unsupported AI service type' };
    }
  }

  private async integrateOpenAI(data: any) {
    // TODO: Implement OpenAI integration
    return {
      service: 'openai',
      response: 'OpenAI integration placeholder',
      tokens: 150,
    };
  }

  private async integrateMapsService(data: any) {
    // TODO: Implement Maps service integration
    return {
      service: 'maps',
      response: 'Maps service integration placeholder',
      distance: 12.5,
      duration: 25,
    };
  }

  async generateSemesterPlan(dto: { studentId: string; requestedCredits: number; semesterId: string }) {
    const { studentId, requestedCredits, semesterId } = dto;
    this.logger.log(`Generating semester plan for student ${studentId}`);

    const [allCourses, prereqs, statuses, sections] = await Promise.all([
      this.courseRepo.find(),
      this.prereqRepo.find(),
      this.statusRepo.find({ where: { studentId } }),
      this.sectionRepo
        .createQueryBuilder('s')
        .leftJoinAndSelect('s.course', 'course')
        .leftJoinAndSelect('s.semesterDay', 'day')
        .where('day.semesterId = :semesterId', { semesterId })
        .getMany(),
    ]);

    // Estimate completed credits from PASSED courses
    const passedCourseIds = new Set(statuses.filter((s) => s.status === 'PASSED').map((s) => s.courseId));
    const completedCredits = allCourses.filter((c) => passedCourseIds.has(c.id)).reduce((a, c) => a + (c.creditHours || 0), 0);

    // Eligible courses after hard rules
    const eligible = this.validator.filterEligibleCourses({
      allCourses,
      statuses,
      prerequisites: prereqs,
      completedCredits,
    });

    // Prepare payload for n8n
    const balanceWeight = Number(this.configService.get('AI_BALANCE_WEIGHT') ?? 0.4);
    const payload = {
      studentId,
      requestedCredits,
      objectives: { maximizeCredits: true, balanceWeight },
      eligibleCourses: eligible.map((c) => ({ code: c.code, creditHours: c.creditHours, hasTheoretical: c.hasTheoretical, hasPractical: c.hasPractical })),
      schedule: sections.map((s) => ({
        courseCode: s.course?.code,
        sectionType: s.sectionType,
        dayOfWeek: s.semesterDay?.dayOfWeek,
        slots: s.slots,
      })),
    };

    // Call n8n webhook
    const url = this.configService.get<string>('N8N_SEMESTER_PLANNER_URL');
    let aiPlan: any = null;
    try {
      if (url) {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        aiPlan = await resp.json();
      }
    } catch (e) {
      this.logger.error('n8n call failed', e as any);
    }

    // Fallback: greedy selection by credits if n8n absent or invalid
    const courseByCode = new Map(allCourses.map((c) => [c.code, c]));
    const suggested = Array.isArray(aiPlan?.selectedCourses) ? aiPlan.selectedCourses : [];
    let assignments = suggested;

    if (!assignments.length) {
      // Pick highest credit eligible courses and assign first available sections if any
      const sorted = [...eligible].sort((a, b) => b.creditHours - a.creditHours);
      const picked: any[] = [];
      let sum = 0;
      for (const c of sorted) {
        if (sum + c.creditHours > requestedCredits) continue;
        const byCourse = sections.filter((s) => s.course?.id === c.id);
        if (!byCourse.length) continue;
        picked.push({
          courseCode: c.code,
          sectionAssignments: byCourse.slice(0, 1).map((s) => ({
            type: s.sectionType,
            dayOfWeek: s.semesterDay?.dayOfWeek,
            slots: s.slots,
          })),
        });
        sum += c.creditHours;
        if (sum >= requestedCredits) break;
      }
      assignments = picked;
    }

    // Validate
    const validation = this.validator.validateAll({ assignments, allCourses, sections });
    return {
      studentId,
      requestedCredits,
      assignments,
      validation,
      rationale: aiPlan?.rationale,
      score: aiPlan?.score,
      source: aiPlan ? 'n8n' : 'fallback',
    };
  }
}
