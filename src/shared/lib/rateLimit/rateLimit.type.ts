type Window =
  { m: number; h?: number; d?: number } | { m?: number; h: number; d?: number } | { m?: number; h?: number; d: number };

export type Options = {
  key: "auth" | "ip" | "email";
  window: Window;
  limit: number;
  route: string;
  message?: string;
};
