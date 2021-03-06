import passport from "passport";

const hostURL = process.env.HOST || process.env.FRONTEND_HOST;

const buildAuthRoutes = (app, callbackPath, ensureLoggedIn) => {
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
      failureRedirect: `${hostURL}/auth/login`
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
          return res.redirect(`${hostURL}${returnTo}`);
        }
      } catch {
        // just redirect normally below
      }
      res.redirect(hostURL);
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
