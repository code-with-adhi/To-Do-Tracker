import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TodoListPage from "./pages/TodoListPage";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem("userId");
      const storedUsername = localStorage.getItem("username");
      setIsLoggedIn(!!userId);
      setUsername(storedUsername || "");
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location.pathname]); // Add location.pathname to re-run on route change

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <header className="app-header">
      <h1>My To-Do App</h1>
      <nav>
        {isLoggedIn ? (
          <>
            <span className="user-greeting">Welcome, {username}!</span>
            <button onClick={handleLogout} className="logout-button">
              Log Out
            </button>
          </>
        ) : (
          <>
            {isLoginPage && <Link to="/signup">Signup</Link>}
            {isSignupPage && <Link to="/login">Login</Link>}
            {!isLoginPage && !isSignupPage && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<TodoListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
