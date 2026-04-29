import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const fakeUser = { id: 1, email: "test@test.com", password: "123456" };

        if (email !== fakeUser.email) {
          return done(null, false, { message: "User not found" });
        }

        if (password !== fakeUser.password) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, fakeUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
