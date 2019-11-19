import React, { useContext } from "react";
import { Switch, Route, Redirect, RouteProps } from "react-router-dom";
import { Layout } from "antd";

import { UserContext } from "./App";
import UsersView from "./views/UsersView";
import DevicesView from "./views/DevicesView";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import ProfileView from "./views/ProfileView";

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const user = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={props =>
        user != null && Component != null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/login" />
        )
      }
    />
  );
};

export default function Routes() {
  return (
    <Layout>
      <Switch>
        <Route path="/auth/login" component={LoginView} />
        <PrivateRoute path="/devices" component={DevicesView} />
        <PrivateRoute path="/users" component={UsersView} />
        <PrivateRoute path="/profile" component={ProfileView} />
        <Route path="/" component={HomeView} />
      </Switch>
    </Layout>
  );
}
