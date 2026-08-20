export type ReqPaginate = {
  offset?: number;
  limit?: number;
};

export type ResPaginate = {
  nextOffset: number;
  hasMore: boolean;
};
