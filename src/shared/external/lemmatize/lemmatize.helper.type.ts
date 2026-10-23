import { LemmatizePos, LemmatizeShape } from "./lemmatize.type";

type TryUnionInput = { curr: Omit<LemmatizeShape, "pos">; next?: Partial<Omit<LemmatizeShape, "pos">> };
type TryUnionOutput = { success: true; newLemma: string; newPos: LemmatizePos; newSurfaceForm: string } | { success: false };
export type TryUnion = (input: TryUnionInput) => TryUnionOutput;

type TryClassifyAuxInput = Omit<LemmatizeShape, "surfaceForm">;
type TryClassifyAuxOutput = { success: true; newPos: "modal verb" } | { success: false };
export type TryClassifyAux = (input: TryClassifyAuxInput) => TryClassifyAuxOutput;

type TrySkipLemmatizationInput = Pick<LemmatizeShape, "surfaceForm">;
type TrySkipLemmatizationOutput = { success: true; newLemma: string } | { success: false };
export type TrySkipLemmatization = (input: TrySkipLemmatizationInput) => TrySkipLemmatizationOutput;

type TryOverridePosInput = Pick<LemmatizeShape, "lemma">;
type TryOverridePosOutput = { success: true; newPos: LemmatizePos } | { success: false };
export type TryOverridePos = (input: TryOverridePosInput) => TryOverridePosOutput;
