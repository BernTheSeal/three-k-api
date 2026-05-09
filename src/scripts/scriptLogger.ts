export const logger = {
  running: (msg: string, singleLine?: boolean) => {
    return singleLine
      ? process.stdout.write(`\r\x1b[36m[RUNNING]\x1b[0m ${msg}`)
      : console.log(`\x1b[36m[RUNNING]\x1b[0m ${msg}`);
  },
  done: (msg: string) => console.log(`\x1b[32m[DONE]\x1b[0m ${msg}`),
  skip: (msg: string) => console.log(`\x1b[33m[SKIPPING]\x1b[0m ${msg}`),
  error: (msg: string) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warning: (msg: string) =>
    console.warn(`\x1b[33m\x1b[1m[WARNING]\x1b[0m ${msg}`),
};
