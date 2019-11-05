const config = {
  authority: process.env.OAUTH_CLIENT_AUTHORITY,
  client_id: process.env.OAUTH_CLIENT_ID,
  client_secret: process.env.OAUTH_CLIENT_SECRET,
  redirect_uri: "http://localhost:3000/authentication/callback",
  post_logout_redirect_uri: "http://localhost:3000",
  loadUserInfo: true,
  scope: "openid profile email",
  response_type: "id_token token",
  silent_redirect_uri: "http://localhost:3000/authentication/silent_callback",
  automaticSilentRenew: true,
  triggerAuthFlow: true
};

export default config;
