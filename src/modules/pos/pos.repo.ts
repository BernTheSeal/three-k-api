import { dbProvider } from "@/shared/lib/db";
import { PosEntity } from "@/shared/types/entities";

const getAll = async (): Promise<PosEntity[]> => {
  const executor = dbProvider.getExecutor<PosEntity>();

  const response = await executor(
    `
    SELECT * FROM pos
    `,
    [],
  );

  return response.rows;
};

export const posRepo = {
  getAll,
};
