import { SentenceWordEntity } from "@/shared/types/entities";
import { MutateTxOptions } from "@/shared/types/transaction.type";

type CreateBulkParams = { sentenceId: number; words: string[]; indexes: number[] };
export type CreateBulk = (params: CreateBulkParams, tx?: MutateTxOptions) => Promise<void>;
