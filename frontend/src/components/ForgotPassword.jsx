import { useState } from "react";
import { forgotPassword, verifyOtp } from "../api/authApi";

function ForgotPassword({ goToLogin, goToResetPassword, language, setLanguage }) {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const isTamil = language === "Tamil";
  const uiText = isTamil
    ? {
        back: "← உள்நுழைவுக்கு திரும்பு",
        heading: "கடவுச்சொல் மறந்துவிட்டதா?",
        subtitle: "உங்கள் மின்னஞ்சல் முகவரிக்கு உறுதிப்படுத்தல் OTP அனுப்பப்படும்.",
        emailLabel: "மின்னஞ்சல் முகவரி",
        emailPlaceholder: "உங்கள் பதிவுசெய்யப்பட்ட மின்னஞ்சலை உள்ளிடவும்",
        button: "OTP அனுப்பு",
        loading: "அனுப்புகிறது...",
        otpSent: "OTP அனுப்பப்பட்டது:",
        otpLabel: "OTP-ஐ உள்ளிடவும்",
        otpPlaceholder: "6 இலக்க OTP-ஐ உள்ளிடவும்",
        verifyButton: "OTP-ஐ சரிபார்க்கவும்",
        verifying: "சரிபார்க்கிறது...",
        toggle: "English",
      }
    : {
        back: "← Back to Login",
        heading: "Forgot Password?",
        subtitle: "We will send a verification OTP to your email.",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your registered email",
        button: "SEND OTP",
        loading: "SENDING...",
        otpSent: "OTP sent to:",
        otpLabel: "Enter OTP",
        otpPlaceholder: "Enter 6 digit OTP",
        verifyButton: "VERIFY OTP",
        verifying: "VERIFYING...",
        toggle: "தமிழ்",
      };

  const sendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      alert(isTamil ? "உங்கள் மின்னஞ்சலை உள்ளிடவும்" : "Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setOtpSent(true);
      alert(data.message || (isTamil ? "OTP வெற்றிகரமாக அனுப்பப்பட்டது" : "OTP sent successfully"));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert(isTamil ? "OTP-ஐ உள்ளிடவும்" : "Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(email, otp);
      goToResetPassword(email, otp);
    } catch (error) {
      alert(error.message);
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
        <div className="back-link" onClick={goToLogin}>
          {uiText.back}
        </div>

        <h2>{uiText.heading}</h2>

        <p className="subtitle">
          {uiText.subtitle}
        </p>

        {!otpSent ? (
          <form onSubmit={sendOTP}>
            <label>{uiText.emailLabel}</label>

            <input
              type="email"
              placeholder={uiText.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="main-button" disabled={loading}>
              {loading ? uiText.loading : uiText.button}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <div className="otp-message">
              {uiText.otpSent}
              <strong>{email}</strong>
            </div>

            <label>{uiText.otpLabel}</label>

            <input
              type="text"
              maxLength="6"
              placeholder={uiText.otpPlaceholder}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="main-button" disabled={loading}>
              {loading ? uiText.verifying : uiText.verifyButton}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;