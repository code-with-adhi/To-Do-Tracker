// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage";
import TodoListPage from "./pages/TodoListPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>My To-Do App</h1>
          <nav>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* The main to-do list page. We'll add auth logic here later. */}
            <Route path="/" element={<TodoListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
