export type ConstructorType<D extends unknown[]> = {
  message: string;
  code: string;
  isOperational?: boolean;
  details?: D;
  cause?: unknown;
};
