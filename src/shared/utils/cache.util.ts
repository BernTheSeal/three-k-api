export const keyBuilder = (namespace: string, version: number, id: string) => {
  return `${namespace}:v${version}:${id}`;
};
