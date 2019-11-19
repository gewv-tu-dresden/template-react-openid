import React, { useContext } from "react";
import { Layout, Menu, Icon } from "antd";
import { Link, useHistory } from "react-router-dom";

import { UserContext } from "../App";

const { Header } = Layout;
const { SubMenu } = Menu;

export default function NavHeader() {
  const userContext = useContext(UserContext);
  const history = useHistory();
  const user = userContext.user;
  const loggedIn = user != null;

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_HOST}/auth/gewv/logout`, {
      mode: "no-cors"
    });
    await userContext.cleanUser();
    history.push("/");
  };

  return (
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
                {user != null && user.name != null ? user.name : "Account"}
              </span>
            }
            className="account-submenu"
            key="account"
          >
            <Menu.Item key="account:profile">
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="account:logout" onClick={logout}>
              Logout
            </Menu.Item>
          </SubMenu>
        )}

        {!loggedIn && (
          <Menu.Item key="account:login" className="login-menuitem">
            <Link to="/auth/login">
              <span>
                <Icon type="login" />
                Login
              </span>
            </Link>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
}
