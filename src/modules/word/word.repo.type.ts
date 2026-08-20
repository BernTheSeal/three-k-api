import { WordSummaryEnriched, WordDetailEnriched } from "@/shared/types/enriched/word.enriched";
import { ReqPaginate } from "@/shared/types/paginate.type";
import { WordFilterShape } from "@/shared/types/shapes/word.shape";
import { FindTxOptions } from "@/shared/types/transaction.type";

type ListParams = {
  filters: WordFilterShape;
  paginate: ReqPaginate;
};
type ListResult = Promise<WordSummaryEnriched[]>;
export type List = (params: ListParams, tx?: FindTxOptions) => ListResult;

type FindByWordParams = { word: string };
type FindByWordResult = Promise<WordDetailEnriched[]>;
export type FindByWord = (params: FindByWordParams, tx?: FindTxOptions) => FindByWordResult;
