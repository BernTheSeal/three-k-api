import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { authConfig } from "@/shared/config/auth.config";

passport.use(
  new GoogleStrategy(
    {
      clientID: authConfig.google.clientId,
      clientSecret: authConfig.google.clientSecret,
      callbackURL: authConfig.google.callbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        return done(null, profile);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
