import React from "react";
import { useReactOidc, withOidcSecure } from "@axa-fr/react-oidc-context";
import { Layout, Menu, Icon } from "antd";
import { Switch, Route, Link } from "react-router-dom";

import UsersView from "./UsersView";
import DevicesView from "./DevicesView";
import HomeView from "./HomeView";
import LoginView from "./LoginView";
import ProfileView from "./ProfileView";

const { Header } = Layout;
const { SubMenu } = Menu;

export default function MainView() {
  const { oidcUser, logout } = useReactOidc();
  const loggedIn = oidcUser != null;

  return (
    <Layout>
      <Header className="header">
        <Link to="/">
          <div className="logo" />
        </Link>

        <Menu theme="dark" mode="horizontal">
          {loggedIn && (
            <Menu.Item key="devices">
              <Link to="/devices">Devices</Link>
            </Menu.Item>
          )}
          {loggedIn && (
            <Menu.Item key="users">
              <Link to="/users">Users</Link>
            </Menu.Item>
          )}

          {loggedIn && (
            <SubMenu
              title={
                <span className="submenu-title-wrapper">
                  <Icon type="user" />
                  {loggedIn ? oidcUser.profile.name : "Account"}
                </span>
              }
              className="account-submenu"
              key="account"
            >
              <Menu.Item key="account:profile">
                <Link to="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item key="account:logaut" onClick={logout}>
                Logout
              </Menu.Item>
            </SubMenu>
          )}

          {!loggedIn && (
            <Menu.Item key="account:login" className="login-menuitem">
              <span>
                <Icon type="login" />
                <Link to="/auth/login">Login</Link>
              </span>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Layout>
        <Switch>
          <Route path="/auth/login" component={LoginView} />
          <Route path="/devices" component={withOidcSecure(DevicesView)} />
          <Route path="/users" component={withOidcSecure(UsersView)} />
          <Route path="/profile" component={withOidcSecure(ProfileView)} />
          <Route path="/" component={HomeView} />
        </Switch>
      </Layout>
    </Layout>
  );
}
