import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import MainView from "./views/MainView";
import "./App.scss";

type ContextProps = {
  user: {
    sub: String,
    email_verified: Boolean,
    name: String,
    preferred_username: String,
    given_name: String,
    family_name: String,
    email: String
  } | null,
  cleanUser: () => Promise<void>,
  loadUser: () => Promise<void>,
}

export const UserContext = React.createContext<ContextProps>({
  user: null,
  cleanUser: async () => { },
  loadUser: async () => { },
})

function App() {
  const loadUser = async () => {
    try {
      const res = await fetch('/api/user')

      console.log(res)
      setUserContext({
        ...userContext,
        user: await res.json(),
      })
      return
    } catch (err) {
      setUserContext({
        ...userContext,
        user: null,
      })
    }
  }

  const cleanUser = async () => {
    setUserContext({
      ...userContext,
      user: null,
    })
  }

  const [userContext, setUserContext] = useState({
    user: null,
    loadUser,
    cleanUser,
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    userContext.loadUser()
  }, [])

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
