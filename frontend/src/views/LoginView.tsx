import React from "react";
import { Layout, Button, Row } from "antd";
import { useReactOidc } from "@axa-fr/react-oidc-context";

export default function LoginView() {
  const { login } = useReactOidc();

  return (
    <Layout.Content>
      <div id="login-oauth-providers">
        <Row>
          <Button onClick={login} className="login-oauth-button">
            GEWV Login
          </Button>
        </Row>
      </div>
    </Layout.Content>
  );
}
