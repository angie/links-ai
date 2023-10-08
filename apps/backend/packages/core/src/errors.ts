export class DataError extends Error {
  constructor(message: string, originalError: unknown) {
    super(message);
    this.name = "DataError";
    this.originalError =
      originalError instanceof Error
        ? originalError
        : new Error(String(originalError));
  }

  public originalError: Error;
}
