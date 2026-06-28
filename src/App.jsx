import { useState } from "react";
import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" ? (
        <HomePage showLogin={() => setPage("login")} />
      ) : (
        <UserLogin goHome={() => setPage("home")} />
      )}
    </>
  );
}

export default App;