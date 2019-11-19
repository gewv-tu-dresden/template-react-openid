import React from "react";
import { Layout, Button, Row } from "antd";

const apiHost = process.env.HOST || process.env.REACT_APP_API_HOST;

export default function LoginView() {
  return (
    <Layout.Content>
      <div id="login-oauth-providers">
        <Row>
          <a
            href={`${apiHost}/auth/gewv/login?returnTo=${window.location.pathname}`}
          >
            <Button className="login-oauth-button">GEWV Login</Button>
          </a>
        </Row>
      </div>
    </Layout.Content>
  );
}
