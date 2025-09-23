enum ErrorTypes {
  "InvalidRequestBody",
  "InternalServerError",
}

export class ResourceNotFound extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = 404;
  }
}

export class InvalidRequestBody extends Error {
  status: number;
  path?: string[];

  constructor(message: string, path?: string[]) {
    super(message);
    this.path = path || [];
    this.status = 400;
  }
}

export class InternalServerError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}
