import { useState } from "react";

import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import WorkoutDashboard from "./components/WorkoutDashboard";
import WorkoutDetails from "./components/WorkoutDetails";

function App() {

  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && (
        <HomePage
          showLogin={() => setPage("login")}
          showRegister={() => setPage("register")}
        />
      )}

      {page === "login" && (
        <UserLogin
          goHome={() => setPage("home")}
        />
      )}

      {page === "register" && (
        <Register
          goHome={() => setPage("home")}
          nextPage={() => setPage("welcome")}
        />
      )}

      {page === "welcome" && (
        <Welcome
          next={() => setPage("dashboard")}
        />
      )}

      {page === "dashboard" && (
        <WorkoutDashboard
          next={() => setPage("details")}
        />
      )}

      {page === "details" && (
        <WorkoutDetails
          goDashboard={() => setPage("dashboard")}
        />
      )}
    </>
  );
}

export default App;