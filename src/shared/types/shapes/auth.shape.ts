import { UserEntity, AuthAccountEntity } from "../entities";

export type AuthTokensShape = { accessToken: string; refreshToken: string };

export type UserAuthInfoShape = {
  user: UserEntity;
  authAccount: Omit<AuthAccountEntity, "passwordHash" | "userId">;
};

export type RegistrationCredentialShape = Pick<AuthAccountEntity, "email"> & Pick<UserEntity, "username"> & { password: string };

export type PasswordChangeShape = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};
