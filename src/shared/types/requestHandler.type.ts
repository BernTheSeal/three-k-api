import { RequestHandler } from "express";

type JwtPayload = {
  userId: number;
  familyId: string;
  authAccountId: number;
};

type LocalsWithData<D> = D extends undefined ? { user: JwtPayload } : { validatedData: D; user: JwtPayload };

type PublicLocalsWithData<D> = D extends undefined ? {} : { validatedData: D };

export type AuthHandler<D = undefined> = RequestHandler<{}, any, {}, {}, LocalsWithData<D>>;

export type PublicHandler<D = undefined> = RequestHandler<{}, any, {}, {}, PublicLocalsWithData<D>>;
