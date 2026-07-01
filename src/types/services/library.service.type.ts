import { Senses } from "../../schemas/validators/library.validator";

type FetchSensesResponse = Map<string, Senses[]>;
type FetchSensesInput = { word: string };

export type LibraryService = {
  fetchSenses: (data: FetchSensesInput) => Promise<FetchSensesResponse>;
};
