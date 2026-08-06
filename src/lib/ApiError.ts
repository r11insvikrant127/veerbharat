// src/lib/ApiError.ts

export default class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];
  public readonly success: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}