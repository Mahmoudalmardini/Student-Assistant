import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(`User with username '${username}' already exists`, HttpStatus.CONFLICT);
  }
}

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`User with email '${email}' already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid username or password', HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Invalid or expired token', HttpStatus.UNAUTHORIZED);
  }
}

export class EmailNotVerifiedException extends HttpException {
  constructor() {
    super('Email not verified. Please verify your email before logging in.', HttpStatus.FORBIDDEN);
  }
}

export class AccountLockedException extends HttpException {
  constructor() {
    super('Account is temporarily locked due to multiple failed login attempts', HttpStatus.FORBIDDEN);
  }
}

