import { UserWordEntity } from "@/shared/types/entities/userWord.entity";
import { MutateTxOptions, FindTxOptions } from "@/shared/types/transaction.type";

type CreateParams = Omit<UserWordEntity, "createdAt" | "updatedAt">;
type CreateResponse = Promise<UserWordEntity>;
export type Create = (params: CreateParams, tx?: MutateTxOptions) => CreateResponse;

type RemoveParams = Pick<UserWordEntity, "wordId" | "userId">;
type RemoveResponse = Promise<Pick<UserWordEntity, "wordId"> | undefined>;
export type Remove = (params: RemoveParams, tx?: MutateTxOptions) => RemoveResponse;

type UpdateParams = Partial<Omit<UserWordEntity, "created_at" | "updated_at" | "userId" | "wordId">> &
  Pick<UserWordEntity, "userId" | "wordId">;
type UpdateResponse = Promise<UserWordEntity | undefined>;
export type Update = (params: UpdateParams, tx?: MutateTxOptions) => UpdateResponse;
