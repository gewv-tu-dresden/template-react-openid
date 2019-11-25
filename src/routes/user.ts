const filterUser = userWithTokens => {
  const userWithOut = { ...userWithTokens };
  delete userWithOut.access_token;
  delete userWithOut.refresh_token;

  return userWithOut;
};

const buildUserRoutes = (app, ensureLoggedIn) => {
  app.use("/api/user", ensureLoggedIn, (req, res) => {
    res.send(filterUser(req.user));
  });
};

export default buildUserRoutes;
