type SingleflightKey = `word:${string}` | `dictionary:${string}`;

const singleflightMap = new Map<
  SingleflightKey,
  {
    promise: Promise<unknown>;
    id: number;
  }
>();

let promiseId = 0;

const run = async <T>(key: SingleflightKey, cb: () => Promise<T>): Promise<T> => {
  const existing = singleflightMap.get(key);

  if (existing) {
    return existing.promise as Promise<T>;
  }

  const id = ++promiseId;

  const promise = cb();
  singleflightMap.set(key, { promise, id });

  try {
    return await promise;
  } finally {
    singleflightMap.delete(key);
  }
};

export const singleFlightHelper = {
  run,
};
