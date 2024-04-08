export class GenericError extends Error {
  name: string;
  statusCode: number;
  message: string;

  constructor(name: string, statusCode: number, message: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class AuthError extends GenericError {
  constructor(message: string) {
    super("AuthError", 401, message);
  }
}

export class BadRequestError extends GenericError {
  constructor(message: string) {
    super("BadRequestError", 400, message);
  }
}

export class ServerError extends GenericError {
  constructor(message: string) {
    super("ServerError", 500, message);
  }
}

export class RateLimitError extends GenericError {
  constructor(message: string) {
    super("RateLimitError", 429, message);
  }
}
