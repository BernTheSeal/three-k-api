import { UserWordEntity } from "@/shared/types/entities";

type CreateInput = Omit<UserWordEntity, "createdAt" | "updatedAt">;
type CreateOutput = Promise<UserWordEntity>;
export type Create = (input: CreateInput) => CreateOutput;

type RemoveInput = Pick<UserWordEntity, "userId" | "wordId">;
type RemoveOutput = Promise<Pick<UserWordEntity, "wordId">>;
export type Remove = (input: RemoveInput) => RemoveOutput;

type UpdateInput = Partial<Omit<UserWordEntity, "created_at" | "updated_at" | "userId" | "wordId">> &
  Pick<UserWordEntity, "userId" | "wordId">;
type UpdateOutput = Promise<UserWordEntity>;
export type Update = (input: UpdateInput) => UpdateOutput;
