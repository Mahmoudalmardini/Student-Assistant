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

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedOperationException extends HttpException {
  constructor(message: string = 'You are not authorized to perform this operation') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

