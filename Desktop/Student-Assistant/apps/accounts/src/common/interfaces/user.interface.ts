export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  COLLEGE_COORDINATOR = 'college_coordinator',
  TRANSPORTATION_COORDINATOR = 'transportation_coordinator',
  SUPER_ADMIN = 'super_admin',
}

export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

