import { useEffect, useState } from "react";
import "./App.css";
import { isAdminUser } from "./utils/adminUser";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./components/Dashboard";
import Agriculture from "./components/Agriculture";
import Services from "./components/Services";

function App() {
  const [page, setPage] = useState("loading");
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("greenIdeaLanguage") || "English";
  });

  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("greenIdeaLanguage", language);
  }, [language]);

  // Check whether user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("greenIdeaUser");
    const savedToken = localStorage.getItem("greenIdeaToken");

    const timer = setTimeout(() => {
      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          const normalizedUser = {
            ...parsedUser,
            is_admin: isAdminUser(parsedUser),
            email: parsedUser?.email || "",
            username: parsedUser?.username || "Farmer",
          };
          setUser(normalizedUser);
          setPage("dashboard");
        } catch (error) {
          console.error("Invalid saved user data:", error);

          localStorage.removeItem("greenIdeaUser");
          localStorage.removeItem("greenIdeaToken");

          setPage("login");
        }
      } else {
        setPage("login");
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // -----------------------------
  // AUTHENTICATION NAVIGATION
  // -----------------------------

  const goToLogin = () => {
    setPage("login");
  };

  const goToRegister = () => {
    setPage("register");
  };

  const goToForgotPassword = () => {
    setPage("forgot");
  };

  // -----------------------------
  // RESET PASSWORD
  // -----------------------------

  const goToResetPassword = (email, otp) => {
    setResetData({
      email,
      otp,
    });

    setPage("reset");
  };

  // -----------------------------
  // LOGIN SUCCESS
  // -----------------------------

  const handleLoginSuccess = (userData) => {
    const normalizedUser = {
      ...userData,
      is_admin: isAdminUser(userData),
      email: userData?.email || "",
      username: userData?.username || "Farmer",
    };

    setUser(normalizedUser);

    localStorage.setItem(
      "greenIdeaUser",
      JSON.stringify(normalizedUser)
    );

    setPage("dashboard");
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------

  const handleLogout = () => {
    localStorage.removeItem("greenIdeaToken");
    localStorage.removeItem("greenIdeaUser");

    setUser(null);

    setPage("login");
  };

  // -----------------------------
  // PAGE NAVIGATION
  // -----------------------------

  const openAgriculture = () => {
    setPage("agriculture");
  };

  const openServices = () => {
    setPage("services");
  };

  const backToDashboard = () => {
    setPage("dashboard");
  };

  return (
    <div className="app">

      {/* LOADING PAGE */}

      {page === "loading" && (
        <LoadingScreen />
      )}


      {/* LOGIN PAGE */}

      {page === "login" && (
        <Login
          goToRegister={goToRegister}
          goToForgotPassword={goToForgotPassword}
          onLoginSuccess={handleLoginSuccess}
          language={language}
          setLanguage={setLanguage}
        />
      )}


      {/* REGISTER PAGE */}

      {page === "register" && (
        <Register
          goToLogin={goToLogin}
          language={language}
          setLanguage={setLanguage}
        />
      )}


      {/* FORGOT PASSWORD PAGE */}

      {page === "forgot" && (
        <ForgotPassword
          goToLogin={goToLogin}
          goToResetPassword={goToResetPassword}
          language={language}
          setLanguage={setLanguage}
        />
      )}


      {/* RESET PASSWORD PAGE */}

      {page === "reset" && (
        <ResetPassword
          goToLogin={goToLogin}
          email={resetData.email}
          otp={resetData.otp}
          language={language}
          setLanguage={setLanguage}
        />
      )}


      {/* DASHBOARD PAGE */}

      {page === "dashboard" && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onOpenAgriculture={openAgriculture}
          onOpenServices={openServices}
          language={language}
          setLanguage={setLanguage}
        />
      )}


      {/* AGRICULTURE PAGE */}

      {page === "agriculture" && (
        <Agriculture
          onBack={backToDashboard}
          language={language}
          setLanguage={setLanguage}
        />
      )}


      {/* SERVICES PAGE */}

      {page === "services" && (
        <Services
          onBack={backToDashboard}
          user={user}
          language={language}
          setLanguage={setLanguage}
        />
      )}

    </div>
  );
}

export default App;