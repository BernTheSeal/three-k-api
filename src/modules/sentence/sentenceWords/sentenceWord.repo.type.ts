import { SentenceWordEntity } from "@/shared/types/entities";
import { MutateTxOptions } from "@/shared/types/transaction.type";

type CreateBulkParams = {
  sentenceId: SentenceWordEntity["sentenceId"];
  sentenceWords: Omit<SentenceWordEntity, "sentenceId">[];
};
export type CreateBulk = (params: CreateBulkParams, tx?: MutateTxOptions) => Promise<void>;
