import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";
import Register from "./components/Register";
import Welcome from "./components/Welcome";
import WorkoutDashboard from "./components/WorkoutDashboard";
import WorkoutDetails from "./components/WorkoutDetails";
import ChatBot from "./components/ChatBot";
import { api } from "./utils/api";

function App() {
  const [page, setPage] = useState("home");
  const [, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));
  const [theme, setTheme] = useState(() => localStorage.getItem("fitique-theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("fitique-theme", theme);
  }, [theme]);

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme === "light" ? "light" : "dark");
  };

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
      <div className="page-shell flex flex-col items-center justify-center px-6">
        <div className="glass-panel rounded-[2rem] border border-border-pink/40 px-10 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-t-brand-pink border-r-transparent border-b-brand-pink border-l-transparent"></div>
          <p className="mb-2 font-['Comfortaa'] text-lg tracking-wider text-text-primary">Loading Fitique...</p>
          <p className="font-quick text-[11px] font-bold uppercase tracking-[0.3em] text-brand-pink">light weight baby</p>
        </div>
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
          theme={theme}
          onThemeChange={handleThemeChange}
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
          user={user}
        />
      )}

      <ChatBot />
    </>
  );
}

export default App;