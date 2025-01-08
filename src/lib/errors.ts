type ErrorMetadata = Record<string, unknown>;

interface ErrorOptions {
  message?: string;
  context?: string;
  metadata?: ErrorMetadata;
}

export const createErrorFactory = (code: string) => {
  return (options: ErrorOptions = {}) => {
    const error = new Error(options.message || code);
    error.name = code;
    Object.assign(error, {
      code,
      context: options.context,
      metadata: options.metadata
    });
    return error;
  };
};
