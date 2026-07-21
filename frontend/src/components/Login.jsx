import { useState } from "react";
import { loginUser } from "../api/authApi";

function Login({ goToRegister, goToForgotPassword, onLoginSuccess, language, setLanguage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isTamil = language === "Tamil";
  const uiText = isTamil
    ? {
        brandTitle: "GREEN IDEA",
        brandSubtitle: "விவசாய எதிர்காலத்திற்கான சூழல்-அறிவார்ந்த தொழில்நுட்பம் வேலை வாய்ப்புகளை பெறுங்கள்.",
        heading: "மீண்டும் வரவேற்கிறோம்",
        subtitle: "Green Idea-வில் தொடர உள்நுழையவும்",
        emailLabel: "மின்னஞ்சல் முகவரி",
        emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
        passwordLabel: "கடவுச்சொல்",
        passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
        forgot: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
        button: "உள்நுழைக",
        loading: "உள்நுழைகிறது...",
        switchText: "கணக்கு இல்லையா?",
        createAccount: "கணக்கு உருவாக்கவும்",
        toggle: "English",
      }
    : {
        brandTitle: "GREEN IDEA",
        brandSubtitle: "Smart technology for a better agricultural future and job opportunities.",
        heading: "Welcome Back",
        subtitle: "Login to continue to Green Idea",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        forgot: "Forgot Password?",
        button: "LOGIN",
        loading: "LOGGING IN...",
        switchText: "Don't have an account?",
        createAccount: "Create Account",
        toggle: "தமிழ்",
      };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert(isTamil ? "மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்" : "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("greenIdeaToken", data.token);
      localStorage.setItem("greenIdeaUser", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (error) {
      alert(error.message || (isTamil ? "உள்நுழைவு தோல்வியடைந்தது" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="logo">GI</div>
          <h1>
            GREEN <span>IDEA</span>
          </h1>
          <p>{uiText.brandSubtitle}</p>
        </div>

        <div className="auth-card">
          <div className="auth-top-row">
            <button type="button" className="lang-toggle" onClick={() => setLanguage(isTamil ? "English" : "Tamil")}>{uiText.toggle}</button>
          </div>
          <h2>{uiText.heading}</h2>
          <p className="subtitle">{uiText.subtitle}</p>

          <form onSubmit={handleLogin}>
            <label>{uiText.emailLabel}</label>
            <input
              type="email"
              placeholder={uiText.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>{uiText.passwordLabel}</label>
            <input
              type="password"
              placeholder={uiText.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="forgot-password" onClick={goToForgotPassword}>
              {uiText.forgot}
            </div>

            <button className="main-button" disabled={loading}>
              {loading ? uiText.loading : uiText.button}
            </button>
          </form>

          <p className="switch-text">
            {uiText.switchText}
            <span onClick={goToRegister}>{uiText.createAccount}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;