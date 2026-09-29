import { getExecutor } from "@/shared/lib/db/db.provider";
import { PosEntity } from "@/shared/types/entities";

const getAll = async (): Promise<PosEntity[]> => {
  const executor = getExecutor<PosEntity>();

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
