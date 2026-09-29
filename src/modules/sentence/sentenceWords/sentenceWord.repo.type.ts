import { MutateTxOptions } from "@/shared/types/transaction.type";

type CreateBulkParams = { sentenceId: number; surfaceForms: string[]; wordIds: number[] };
export type CreateBulk = (params: CreateBulkParams, tx?: MutateTxOptions) => Promise<void>;
