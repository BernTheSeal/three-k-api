export type FindUnknownWordsInput = { lemma: string; surfaceForm: string; wordId: number | null; pos: string };
export type FindUnknownPosInput = { pos: string };
export type FindPuncInARowInput = { lemma: string; surfaceForm: string; wordId: number | null; pos: string };
export type AddDisplayFlagsInput = { surfaceForm: string; pos: string };
