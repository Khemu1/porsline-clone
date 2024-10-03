/* eslint-disable @typescript-eslint/no-explicit-any */

export class CustomError extends Error {
  message: string;
  statusCode: number;
  status: string;
  safe: boolean;
  type: string;
  details: string = "";
  errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = 500,
    type: string = "server error",
    safe: boolean = false,
    details?: string,
    errors?: Record<string, string>
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode >= 200 && statusCode < 300 ? "success" : "fail";
    this.safe = safe;
    this.details = details || "";
    this.type = type;
    this.errors = errors;
    // this.stack = new Error().stack;
  }
}