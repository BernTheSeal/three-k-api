import { WordFilterShape, WordDetailShape, WordDetailWithSenseShape, WordSummaryShape } from "@/shared/types/shapes/word.shape";
import { ReqPaginate, ResPaginate } from "@/shared/types/paginate.type";

type ListInput = { filters: WordFilterShape; paginate?: ReqPaginate };
type ListOutput = Promise<{
  paginate: ResPaginate;
  total: number;
  words: WordSummaryShape[];
}>;
export type List = (input: ListInput) => ListOutput;

type FindByWordInput = { word: string };
type FindByWordOutput = Promise<WordDetailShape | null>;
export type FindByWord = (input: FindByWordInput) => FindByWordOutput;

type FindByWordWithSensesInput = { word: string };
type FindByWordWithSensesOutput = Promise<WordDetailWithSenseShape | null>;
export type FindByWordWithSenses = (input: FindByWordWithSensesInput) => FindByWordWithSensesOutput;
