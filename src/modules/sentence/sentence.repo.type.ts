import { MutateTxOptions } from "@/shared/types/transaction.type";
import { SentenceEntity } from "@/shared/types/entities";

type CreateParams = Pick<SentenceEntity, "content" | "userId">;
type CreateResult = Promise<SentenceEntity>;
export type Create = (params: CreateParams, tx?: MutateTxOptions) => CreateResult;
