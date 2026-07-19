import { useState } from "react";
import { resetPassword } from "../api/authApi";

function ResetPassword({ goToLogin, email, otp, language, setLanguage }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isTamil = language === "Tamil";
  const uiText = isTamil
    ? {
        heading: "புதிய கடவுச்சொல்லை உருவாக்கவும்",
        subtitle: "உங்கள் அடையாளம் சரிபார்க்கப்பட்டுள்ளது. புதிய கடவுச்சொல்லை உருவாக்கவும்.",
        passwordLabel: "புதிய கடவுச்சொல்",
        passwordPlaceholder: "புதிய கடவுச்சொல்லை உள்ளிடவும்",
        confirmPasswordLabel: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        confirmPasswordPlaceholder: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
        button: "கடவுச்சொல்லை மீட்டமை",
        loading: "மீட்டமைக்கிறது...",
        toggle: "English",
      }
    : {
        heading: "Create New Password",
        subtitle: "Your identity has been verified. Create a new password.",
        passwordLabel: "New Password",
        passwordPlaceholder: "Enter new password",
        confirmPasswordLabel: "Confirm New Password",
        confirmPasswordPlaceholder: "Confirm new password",
        button: "RESET PASSWORD",
        loading: "RESETTING...",
        toggle: "தமிழ்",
      };

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert(isTamil ? "கடவுச்சொல் குறைந்தது 6 எழுத்துகளாவது இருக்க வேண்டும்" : "Password must contain at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert(isTamil ? "கடவுச்சொற்கள் பொருந்தவில்லை" : "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword(email, otp, password);
      alert(data.message || (isTamil ? "கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது" : "Password reset successful"));
      goToLogin();
    } catch (error) {
      alert(error.message || (isTamil ? "கடவுச்சொல்லை மீட்டமைக்க முடியவில்லை" : "Password reset failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-top-row">
          <button type="button" className="lang-toggle" onClick={() => setLanguage(isTamil ? "English" : "Tamil")}>{uiText.toggle}</button>
        </div>
        <h2>{uiText.heading}</h2>

        <p className="subtitle">
          {uiText.subtitle}
        </p>

        <form onSubmit={handleReset}>
          <label>{uiText.passwordLabel}</label>

          <input
            type="password"
            placeholder={uiText.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>{uiText.confirmPasswordLabel}</label>

          <input
            type="password"
            placeholder={uiText.confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="main-button" disabled={loading}>
            {loading ? uiText.loading : uiText.button}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;