const getSafeOffset = ({ offset, limit }: { offset?: number; limit: number }) => {
  return Math.floor((offset ?? 0) / limit) * limit;
};

export { getSafeOffset };
