import axios from "axios";
import { fetchSensesSchema } from "../schemas/validators/library.validator";
import { LibraryService } from "../types/services/library.service.type";

import { Senses } from "../schemas/validators/library.validator";

export const libraryService: LibraryService = {
  async fetchSenses(data) {
    const { word } = data;

    try {
      const res = await axios.get(`https://freedictionaryapi.com/api/v1/entries/en/${word}`, { timeout: 5000 });

      const parsedData = fetchSensesSchema.parse(res.data);

      const mappedData = parsedData.entries.reduce(
        (acc: Map<string, Senses[]>, curr) => acc.set(curr.partOfSpeech, [...(acc.get(curr.partOfSpeech) || []), ...curr.senses]),
        new Map<string, Senses[]>(),
      );

      return mappedData;
    } catch (error) {
      console.error(error);
      return new Map();
    }
  },
};
