const time = () => `\x1b[90m${new Date().toTimeString().slice(0, 8)}\x1b[0m`;

type Options = {
  tag?: string;
  singleLine?: boolean;
  gap?: boolean;
  payload?: unknown;
};

let lineOpen = false;

const write = (color: string, defaultTag: string, msg: string, options: Options = {}) => {
  const { tag = defaultTag, singleLine = false, gap = false, payload } = options;
  const content = `[${color}${tag.toUpperCase()}\x1b[0m] ${time()} ${msg}`;

  if (singleLine) {
    lineOpen = true;
    return process.stdout.write(`\r\x1b[2K${content}`);
  }

  if (lineOpen) {
    process.stdout.write("\n");
    lineOpen = false;
  }

  console.log(content);
  if (payload !== undefined) console.log(payload);
  if (gap) console.log();
  return;
};

process.on("exit", () => {
  if (lineOpen) process.stdout.write("\n");
});

const title = (msg: string, color: "green" | "red" | "yellow" | "cyan" = "cyan") => {
  const colors = { green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m", cyan: "\x1b[36m" };
  const c = colors[color];
  const text = msg.toUpperCase();
  const line = "═".repeat(text.length + 4);

  if (lineOpen) {
    process.stdout.write("\n");
    lineOpen = false;
  }

  console.log();
  console.log(`${c}╔${line}╗\x1b[0m`);
  console.log(`${c}║\x1b[0m  \x1b[1m${text}\x1b[0m  ${c}║\x1b[0m`);
  console.log(`${c}╚${line}╝\x1b[0m`);
  console.log();
};

const success = (msg: string, options?: Options) => write("\x1b[32m", "SUCCESS", msg, options);
const warning = (msg: string, options?: Options) => write("\x1b[33m", "WARNING", msg, options);
const info = (msg: string, options?: Options) => write("\x1b[36m", "INFO", msg, options);
const error = (msg: string, options?: Options) => write("\x1b[31m", "ERROR", msg, options);

export const logUtil = { success, error, info, warning, title };
