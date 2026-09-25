import { CreateDto } from "./sentence.validator";
import { AuthHandler } from "@/shared/types/requestHandler.type";

export type Create = AuthHandler<CreateDto>;
