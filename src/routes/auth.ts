import passport from "passport";

const buildAuthRoutes = (app, callbackPath) => {
  app.get("/auth/gewv/login", (req, res, next) => {
    const { returnTo } = req.query;
    const state = returnTo
      ? Buffer.from(JSON.stringify({ returnTo })).toString("base64")
      : undefined;
    const authenticator = passport.authenticate("oidc", { state });
    authenticator(req, res, next);
  });

  app.use(
    callbackPath,
    passport.authenticate("oidc", {
      failureRedirect: `${process.env.FRONTEND_HOST}/auth/login`
    }),
    (req, res) => {
      try {
        const { state } = req.query;
        const { returnTo } = JSON.parse(
          Buffer.from(state, "base64").toString()
        );

        if (
          typeof returnTo === "string" &&
          returnTo.startsWith("/") &&
          !returnTo.startsWith("/auth/login")
        ) {
          return res.redirect(`${process.env.FRONTEND_HOST}${returnTo}`);
        }
      } catch {
        // just redirect normally below
      }
      res.redirect(process.env.FRONTEND_HOST);
    }
  );

  app.get("/auth/gewv/logout", async function(req, res) {
    req.logout();
    req.session.destroy(err => {
      if (err != null) {
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  });
};

export default buildAuthRoutes;
