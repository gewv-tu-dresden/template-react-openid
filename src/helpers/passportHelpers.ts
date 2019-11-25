import passport from "passport";
import { Strategy, Client, custom } from "openid-client";
import { Request, Response, NextFunction } from "express";

type EnsureFunction = (Request, Response, NextFunction) => any;

const preparePassport = (client: Client): EnsureFunction => {
  passport.use(
    "oidc",
    new Strategy({ client }, (tokenSet, userinfo, done) => {
      return done(null, {
        access_token: tokenSet.access_token,
        refresh_token: tokenSet.refresh_token,
        ...userinfo
      });
    })
  );

  passport.serializeUser((user, next) => {
    next(null, user);
  });

  passport.deserializeUser((obj, next) => {
    next(null, obj);
  });

  // overide the grant function to add the access_token
  client[custom.http_options] = opts => {
    // @ts-ignore
    if (opts.url === client.issuer.token_endpoint && opts.body.access_token) {
      const { access_token } = opts.body;
      delete opts.body.access_token;
      opts.headers = opts.headers || {};
      opts.headers.Authorization = `Bearer ${access_token}`;
    }

    return opts;
  };

  const isAllowedToAccessRessource = async (
    req: Express.Request,
    ressource: string = ""
  ): Promise<boolean> => {
    try {
      if (ressource === "") ressource = process.env.OPENID_DEFAULT_RESSOURCE;
      if (ressource == null) return true;

      await client.grant({
        grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
        audience: client.metadata.client_id,
        permission: ressource,
        // @ts-ignore
        access_token: req.user.access_token
      });
      return true;
    } catch (err) {
      console.debug("Failed to get permission: %j", err);
    }

    return false;
  };

  const ensureLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.isUnauthenticated()) {
      res.sendStatus(404);
      return;
    }

    if (!(await isAllowedToAccessRessource(req))) {
      res.sendStatus(404);
      return;
    }

    return next();
  };

  return ensureLoggedIn;
};

export default preparePassport;
