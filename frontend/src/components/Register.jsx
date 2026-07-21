import { useState } from "react";
import { registerUser } from "../api/authApi";

function Register({ goToLogin, language, setLanguage }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const isTamil = language === "Tamil";
  const uiText = isTamil
    ? {
        brandTitle: "GREEN IDEA",
        brandSubtitle: "விவசாயிகள், போக்குவரத்து நிறுவனங்கள், கடைகள் மற்றும் சமுதாயங்களை இணைக்கவும்.",
        heading: "கணக்கு உருவாக்கவும்",
        subtitle: "Green Idea உடன் உங்கள் பயணத்தைத் தொடங்குங்கள்",
        usernameLabel: "பயனர் பெயர்",
        usernamePlaceholder: "உங்கள் பயனர்பெயரை உள்ளிடவும்",
        emailLabel: "மின்னஞ்சல் முகவரி",
        emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
        passwordLabel: "கடவுச்சொல்",
        passwordPlaceholder: "கடவுச்சொல்லை உருவாக்கவும்",
        confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        confirmPasswordPlaceholder: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        button: "கணக்கு உருவாக்கு",
        loading: "கணக்கு உருவாக்கப்படுகிறது...",
        switchText: "ஏற்கனவே கணக்கு உள்ளதா?",
        login: "உள்நுழை",
        toggle: "English",
      }
    : {
        brandTitle: "GREEN IDEA",
        brandSubtitle: "Connect farmers, transporters, shops and communities.",
        heading: "Create Account",
        subtitle: "Start your journey with Green Idea",
        usernameLabel: "Username",
        usernamePlaceholder: "Enter your username",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email",
        passwordLabel: "Password",
        passwordPlaceholder: "Create password",
        confirmPasswordLabel: "Confirm Password",
        confirmPasswordPlaceholder: "Confirm password",
        button: "CREATE ACCOUNT",
        loading: "CREATING ACCOUNT...",
        switchText: "Already have an account?",
        login: "Login",
        toggle: "தமிழ்",
      };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      alert(isTamil ? "எல்லா புலங்களையும் நிரப்பவும்" : "Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert(isTamil ? "கடவுச்சொற்கள் பொருந்தவில்லை" : "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert(data.message || (isTamil ? "பதிவு வெற்றிகரமாக முடிந்தது" : "Registration successful"));
      goToLogin();
    } catch (error) {
      alert(error.message || (isTamil ? "பதிவு தோல்வியடைந்தது" : "Registration failed"));
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
            JOIN GREEN <span>IDEA</span>
          </h1>

          <p>{uiText.brandSubtitle}</p>
        </div>

        <div className="auth-card">
          <div className="auth-top-row">
            <button type="button" className="lang-toggle" onClick={() => setLanguage(isTamil ? "English" : "Tamil")}>{uiText.toggle}</button>
          </div>
          <h2>{uiText.heading}</h2>

          <p className="subtitle">{uiText.subtitle}</p>

          <form onSubmit={handleRegister}>
            <label>{uiText.usernameLabel}</label>

            <input
              name="username"
              type="text"
              placeholder={uiText.usernamePlaceholder}
              value={formData.username}
              onChange={handleChange}
            />

            <label>{uiText.emailLabel}</label>

            <input
              name="email"
              type="email"
              placeholder={uiText.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
            />

            <label>{uiText.passwordLabel}</label>

            <input
              name="password"
              type="password"
              placeholder={uiText.passwordPlaceholder}
              value={formData.password}
              onChange={handleChange}
            />

            <label>{uiText.confirmPasswordLabel}</label>

            <input
              name="confirmPassword"
              type="password"
              placeholder={uiText.confirmPasswordPlaceholder}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button className="main-button" disabled={loading}>
              {loading ? uiText.loading : uiText.button}
            </button>
          </form>

          <p className="switch-text">
            {uiText.switchText}
            <span onClick={goToLogin}>{uiText.login}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;