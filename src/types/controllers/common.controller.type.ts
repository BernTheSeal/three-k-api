import { RequestHandler } from "express";

type JwtPayload = {
  user_id: number;
  family_id: string;
  auth_account_id: number;
};

type LocalsWithData<D> = D extends undefined
  ? { user: JwtPayload }
  : { validated_data: D; user: JwtPayload };

type PublicLocalsWithData<D> = D extends undefined ? {} : { validated_data: D };

export type AuthHandler<D = undefined> = RequestHandler<
  {},
  any,
  {},
  {},
  LocalsWithData<D>
>;

export type PublicHandler<D = undefined> = RequestHandler<
  {},
  any,
  {},
  {},
  PublicLocalsWithData<D>
>;
