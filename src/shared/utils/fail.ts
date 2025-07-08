export class APIError extends Error {
  constructor(public status: number, message: string, public error?: { message: string }) {
    super(message);
  }
}

export default function fail(status: number, message: string, error?: { message: string }): never {
  console.trace("Fail, cause: " + message);
  throw new APIError(status, message, error);
}
