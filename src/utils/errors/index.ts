enum ErrorCodes {
  "ResourceNotFound",
  "InvalidRequestBody",
  "InternalServerError",
  "TooManyRequests",
}

export class ResourceNotFound extends Error {
  statusCode: number;
  errorCode: ErrorCodes;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.errorCode = ErrorCodes.ResourceNotFound;
  }
}

export class InvalidRequestBody extends Error {
  statusCode: number;
  errorCode: ErrorCodes;
  path?: string[];

  constructor(message: string, path?: string[]) {
    super(message);
    this.statusCode = 400;
    this.errorCode = ErrorCodes.InvalidRequestBody;
    this.path = path || [];
  }
}

export class TooManyRequests extends Error {
  statusCode: number;
  errorCode: ErrorCodes;
  retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message);
    this.statusCode = 429;
    this.errorCode = ErrorCodes.TooManyRequests;
    this.retryAfter = retryAfter || 0;
  }
}

export class InternalServerError extends Error {
  statusCode: number;
  errorCode: ErrorCodes;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
    this.errorCode = ErrorCodes.InternalServerError;
  }
}
