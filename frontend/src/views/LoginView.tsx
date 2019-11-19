import React from "react";
import { Layout, Button, Row } from "antd";

export default function LoginView() {
  return (
    <Layout.Content>
      <div id="login-oauth-providers">
        <Row>
          <a
            href={`http://localhost:4000/auth/gewv/login?returnTo=${window.location.pathname}`}
          >
            <Button className="login-oauth-button">GEWV Login</Button>
          </a>
        </Row>
      </div>
    </Layout.Content>
  );
}
