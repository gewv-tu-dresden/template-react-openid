import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";

import MainView from "./views/MainView";
import "./App.scss";

const UserContext = React.createContext(null)

function App() {
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch('http://localhost:4000/profile', {
        mode: 'no-cors',
      })

      console.log(res)
      setProfile(await res.json())
    }

    loadUser()
  })

  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={profile}>
          <MainView />
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
