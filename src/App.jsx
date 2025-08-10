// src/App.jsx

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
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem("userId");
      setIsLoggedIn(!!userId);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <header className="app-header">
      <h1>My To-Do App</h1>
      <nav>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-button">
            Log Out
          </button>
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
