export interface IAuthService {
  register(dto: any): Promise<AuthResponse>;
  login(dto: any): Promise<AuthResponse>;
  validateUser(username: string, password: string): Promise<User | null>;
  refreshToken(token: string): Promise<AuthResponse>;
  logout(userId: string): Promise<void>;
}

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: any): Promise<User>;
  update(id: string, data: any): Promise<User>;
  delete(id: string): Promise<void>;
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

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  COLLEGE_COORDINATOR = 'college_coordinator',
  TRANSPORTATION_COORDINATOR = 'transportation_coordinator',
  SUPER_ADMIN = 'super_admin',
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

