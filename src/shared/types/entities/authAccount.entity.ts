type CommonAuthAccount = {
  authAccountId: number;
  userId: number;
  providerAccountId: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type LocalAuthAccount = {
  provider: "local";
  passwordHash: string;
} & CommonAuthAccount;

type GoogleAuthAccount = {
  provider: "google";
  passwordHash: null;
} & CommonAuthAccount;

export type AuthAccountEntity = LocalAuthAccount | GoogleAuthAccount;
