import { SentenceEntity } from "@/shared/types/entities";

type CreateInput = Pick<SentenceEntity, "userId" | "content">;
type CreateOutput = Promise<SentenceEntity>;
export type Create = (input: CreateInput) => CreateOutput;
