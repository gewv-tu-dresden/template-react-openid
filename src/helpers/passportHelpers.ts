import passport from "passport";
import { Strategy } from "openid-client";

const preparePassport = client => {
  passport.use(
    "oidc",
    new Strategy({ client }, (tokenSet, userinfo, done) => {
      return done(null, userinfo);
    })
  );

  passport.serializeUser((user, next) => {
    next(null, user);
  });

  passport.deserializeUser((obj, next) => {
    next(null, obj);
  });
};

export default preparePassport;
