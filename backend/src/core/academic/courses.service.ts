import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Prerequisite } from './entities/prerequisite.entity';
function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(','));
  return lines.join('\n');
}

function parseCsv(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = content.trim().split(/\r?\n/);
  if (!lines.length) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => (row[h] = (cols[idx] || '').replace(/^\"|\"$/g, '').replace(/\"\"/g, '"')));
    rows.push(row);
  }
  return { headers, rows };
}

export interface UpsertCourseDto {
  code: string;
  name: string;
  creditHours: number;
  hasTheoretical?: boolean;
  hasPractical?: boolean;
  minCreditsToOpen?: number | null;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Prerequisite) private readonly prereqRepo: Repository<Prerequisite>,
  ) {}

  async list(): Promise<Course[]> {
    return this.courseRepo.find();
  }

  async getById(id: string): Promise<Course> {
    const c = await this.courseRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Course not found');
    return c;
  }

  async create(dto: UpsertCourseDto): Promise<Course> {
    const exists = await this.courseRepo.findOne({ where: { code: dto.code } });
    if (exists) throw new BadRequestException('Course code already exists');
    const created = this.courseRepo.create({ ...dto });
    return this.courseRepo.save(created);
  }

  async update(id: string, dto: Partial<UpsertCourseDto>): Promise<Course> {
    const prev = await this.getById(id);
    await this.courseRepo.update(id, { ...prev, ...dto });
    return this.getById(id);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.courseRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Course not found');
    return { deleted: true };
  }

  async setPrerequisites(courseId: string, prereqCourseIds: string[]): Promise<Prerequisite[]> {
    await this.getById(courseId);
    await this.prereqRepo.delete({ courseId });
    const unique = [...new Set(prereqCourseIds)].filter((x) => x !== courseId);
    const records = unique.map((pid) => this.prereqRepo.create({ courseId, prereqCourseId: pid }));
    return this.prereqRepo.save(records);
  }

  async listPrerequisites(courseId: string): Promise<Prerequisite[]> {
    return this.prereqRepo.find({ where: { courseId } });
  }

  async exportCsv(): Promise<string> {
    const courses = await this.courseRepo.find();
    const prereqs = await this.prereqRepo.find();
    const prereqMap = new Map<string, string[]>();
    for (const p of prereqs) {
      const arr = prereqMap.get(p.courseId) || [];
      arr.push(p.prereqCourseId);
      prereqMap.set(p.courseId, arr);
    }
    const rows = courses.map((c) => ({
      code: c.code,
      name_en: c.name,
      name_ar: '',
      credits: c.creditHours,
      theory_hours: c.hasTheoretical ? c.creditHours : 0,
      practical_hours: c.hasPractical ? c.creditHours : 0,
      category: '',
      semester_hint: '',
      prereq_codes: prereqMap.get(c.id)?.join(';') || '',
    }));
    return toCsv(rows);
  }

  async importCsv(csv: string): Promise<{ created: number; updated: number }> {
    const parsed = parseCsv(csv);
    let created = 0;
    let updated = 0;
    for (const row of parsed.rows as any[]) {
      if (!row || !row.code) continue;
      const dto: UpsertCourseDto = {
        code: String(row.code).trim(),
        name: String(row.name_en || row.name || row.code).trim(),
        creditHours: parseInt(String(row.credits || '0')) || 0,
        hasTheoretical: (row.theory_hours && Number(row.theory_hours) > 0) || false,
        hasPractical: (row.practical_hours && Number(row.practical_hours) > 0) || false,
      };
      const existing = await this.courseRepo.findOne({ where: { code: dto.code } });
      let course: Course;
      if (existing) {
        await this.courseRepo.update(existing.id, { ...existing, ...dto });
        course = await this.courseRepo.findOne({ where: { id: existing.id } });
        updated++;
      } else {
        course = await this.courseRepo.save(this.courseRepo.create(dto));
        created++;
      }
      // prerequisites by code mapping requires a lookup
      const prereqCodes = String(row.prereq_codes || '').split(';').map((s) => s.trim()).filter(Boolean);
      if (prereqCodes.length) {
        const prereqCourses = await this.courseRepo.find({ where: prereqCodes.map((code) => ({ code })) as any });
        await this.setPrerequisites(course.id, prereqCourses.map((pc) => pc.id));
      }
    }
    return { created, updated };
  }
}


