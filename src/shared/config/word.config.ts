export const wordConfig = {
  cache: {
    detail: {
      namespace: "word",
      version: 1,
      ttlSec: 60 * 60 * 24 * 30,
    },

    all: {
      key: "words",
    },
  },
  pagination: {
    limit: 50,
  },
};
