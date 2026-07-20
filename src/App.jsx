import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import WorkoutDashboard from "./components/WorkoutDashboard";
import WorkoutDetails from "./components/WorkoutDetails";
import { api } from "./utils/api";

function App() {
  const [page, setPage] = useState("home");
  const [, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setActiveWorkout(null);
    setPage("home");
  };

  const handleLogin = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    setPage("dashboard");
  };

  const handleRegister = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    setPage("welcome");
  };

  // Check token and fetch user details on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          setToken(storedToken);
          setPage("dashboard");
        } catch (err) {
          console.error("Token validation failed, logging out:", err);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-[#FF4A8B] border-r-transparent border-b-[#FF4A8B] border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-['Comfortaa'] text-lg text-[#A38C97] tracking-wider animate-pulse mb-1">Loading Fitique...</p>
        <p className="font-quick text-[10px] text-brand-pink tracking-[0.25em] font-bold uppercase animate-pulse">light weight baby</p>
      </div>
    );
  }

  return (
    <>
      {page === "home" && (
        <HomePage
          user={user}
          showLogin={() => setPage("login")}
          showRegister={() => setPage("register")}
          goDashboard={() => setPage("dashboard")}
          logout={handleLogout}
        />
      )}
      {page === "login" && (
        <UserLogin 
          goHome={() => setPage(user ? "dashboard" : "home")} 
          onLoginSuccess={handleLogin}
          showRegister={() => setPage("register")}
        />
      )}
      {page === "register" && (
        <Register
          goHome={() => setPage(user ? "dashboard" : "home")}
          onRegisterSuccess={handleRegister}
          showLogin={() => setPage("login")}
        />
      )}
      {page === "welcome" && (
        <Welcome next={() => setPage("dashboard")} user={user} />
      )}
      {page === "dashboard" && (
        <WorkoutDashboard 
          user={user}
          setUser={setUser}
          logout={handleLogout}
          startWorkout={(workout) => {
            setActiveWorkout(workout);
            setPage("details");
          }}
        />
      )}
      {page === "details" && (
        <WorkoutDetails 
          workout={activeWorkout}
          goDashboard={() => setPage("dashboard")} 
        />
      )}
    </>
  );
}

export default App;