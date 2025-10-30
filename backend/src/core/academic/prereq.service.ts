import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prerequisite } from './entities/prerequisite.entity';
import { Course } from './entities/course.entity';

export interface GraphValidationResult {
  ok: boolean;
  cycle?: string[]; // sequence of courseIds forming a cycle
}

@Injectable()
export class PrereqService {
  constructor(
    @InjectRepository(Prerequisite) private readonly prereqRepo: Repository<Prerequisite>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
  ) {}

  async listAll(): Promise<Prerequisite[]> {
    return this.prereqRepo.find();
  }

  async validateGraph(): Promise<GraphValidationResult> {
    const [edges, courses] = await Promise.all([this.listAll(), this.courseRepo.find({ select: ['id'] })]);
    const adjacency = new Map<string, string[]>();
    for (const c of courses) adjacency.set(c.id, []);
    for (const e of edges) {
      if (!adjacency.has(e.courseId)) adjacency.set(e.courseId, []);
      adjacency.get(e.courseId)!.push(e.prereqCourseId);
    }

    const visited = new Set<string>();
    const onPath = new Set<string>();
    const path: string[] = [];

    const dfs = (node: string): string[] | null => {
      if (onPath.has(node)) {
        const idx = path.indexOf(node);
        return idx >= 0 ? path.slice(idx).concat(node) : [node, node];
      }
      if (visited.has(node)) return null;
      visited.add(node);
      onPath.add(node);
      path.push(node);
      for (const nei of adjacency.get(node) || []) {
        const cyc = dfs(nei);
        if (cyc) return cyc;
      }
      path.pop();
      onPath.delete(node);
      return null;
    };

    for (const node of adjacency.keys()) {
      const cyc = dfs(node);
      if (cyc) return { ok: false, cycle: cyc };
    }
    return { ok: true };
  }
}


