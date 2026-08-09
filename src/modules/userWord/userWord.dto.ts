import { CreateDto, RemoveDto, UpdateDto } from "@/modules/userWord/userWord.validator";
import { AuthHandler } from "@/shared/types/requestHandler";

export type Create = AuthHandler<CreateDto>;
export type Remove = AuthHandler<RemoveDto>;
export type Update = AuthHandler<UpdateDto>;
