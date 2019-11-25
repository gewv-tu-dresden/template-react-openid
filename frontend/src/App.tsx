import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import MainView from "./views/MainView";
import "./App.scss";

type ContextProps = {
  user: {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
  } | null;
  cleanUser: () => Promise<void>;
  loadUser: () => Promise<void>;
};

export const UserContext = React.createContext<ContextProps>({
  user: null,
  cleanUser: async () => {},
  loadUser: async () => {}
});

function App() {
  const loadUser = async () => {
    try {
      const res = await fetch("/api/user");

      setUserContext({
        ...userContext,
        user: await res.json()
      });
      return;
    } catch (err) {
      setUserContext({
        ...userContext,
        user: null
      });
    }
  };

  const cleanUser = async () => {
    setUserContext({
      ...userContext,
      user: null
    });
  };

  const [userContext, setUserContext] = useState({
    user: null,
    loadUser,
    cleanUser
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    userContext.loadUser();
  }, []);

  return (
    <div className="App">
      <UserContext.Provider value={userContext}>
        <Router>
          <MainView />
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
