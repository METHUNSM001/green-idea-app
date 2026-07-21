import { useState } from "react";
import Workers from "./Workers";
import TransportService from "./TransportService";
import EquipmentService from "./EquipmentService";

function Services({ onBack, language, setLanguage }) {
  const isTamil = language === "Tamil";
  const [view, setView] = useState("hub");

  const uiText = isTamil
    ? {
        back: "← பின்செல்",
        heading: "🛠️ விவசாய சேவைகள் மற்றும் வேலைகளை தேடுங்கள் ",
        eyebrow: "GREEN IDEA சேவைகள்",
        subtitle: "வேலைகள், போக்குவரத்து மற்றும் உபகரணங்களை கண்டறியவும்",
        toggle: "English",
      }
    : {
        back: "← BACK",
        heading: "🛠️ FARM SERVICES & JOB OPPORTUNITIES",
        eyebrow: "GREEN IDEA SERVICES",
        subtitle: "Find jobs, transport and equipment services",
        toggle: "தமிழ்",
      };

  const services = isTamil
    ? [
        {
          key: "workers",
          icon: "👨‍🌾",
          title: "வேலைகள் மற்றும் வேலைவாய்ப்பு",
          description:
            "விவசாயம், அறுவடை மற்றும் பிற வேலைகளை தேடுங்கள்",
          button: "வேலைகளைப் பெறுங்கள் & வேலைகளைத் தேடுங்கள்",
        },
        {
          key: "transport",
          icon: "🚚",
          title: "போக்குவரத்து சேவைகள்",
          description:
            "பொருட்கள் கொண்டு செல்ல போக்குவரத்தைத் தேடுங்கள் மற்றும் போக்குவரத்தை பதிவு செய்யுங்கள் ",
          button: "போக்குவரத்தைத் தேடு",
        },
        {
          key: "equipment",
          icon: "🚜",
          title: "உபகரண வாடகை",
          description:
            "டிராக்டர், பம்பு மற்றும் மற்ற உபகரணங்களை வாடகைக்கு எடுக்கவும்",
          button: "உபகரணத்தைத் தேடு & உபகரணத்தை பதிவு செய்யுங்கள்",
        },
      ]
    : [
        {
          key: "workers",
          icon: "👨‍🌾",
          title: "Jobs and Work",
          description: "Find farm, harvest and other jobs",
          button: "GET WORKS and REGISTER AS WORKER",
        },
        {
          key: "transport",
          icon: "🚚",
          title: "Transport Services",
          description: "Find transport to move your goods",
          button: "GET TRANSPORT and REGISTER AS TRANSPORTER",
        },
        {
          key: "equipment",
          icon: "🚜",
          title: "Equipment Rental",
          description: "Rent tractors, pumps and farm equipment",
          button: "GET EQUIPMENT and REGISTER AS PROVIDER",
        },
      ];

  const handleServiceAction = (service) => {
    setView(service.key);
  };

  if (view === "workers") {
    return (
      <Workers onBack={() => setView("hub")} language={language} setLanguage={setLanguage} />
    );
  }

  if (view === "transport") {
    return (
      <TransportService onBack={() => setView("hub")} language={language} setLanguage={setLanguage} />
    );
  }

  if (view === "equipment") {
    return (
      <EquipmentService onBack={() => setView("hub")} language={language} setLanguage={setLanguage} />
    );
  }

  return (
    <div className="services-page">
      <nav className="services-navbar">
        <button className="back-button" onClick={onBack}>
          {uiText.back}
        </button>
        <h2>{uiText.heading}</h2>
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLanguage(isTamil ? "English" : "Tamil")}
        >
          {uiText.toggle}
        </button>
      </nav>

      <section className="services-header">
        <p className="eyebrow">{uiText.eyebrow}</p>
        <h1>{uiText.heading}</h1>
        <p>{uiText.subtitle}</p>
      </section>

      <section className="services-grid">
        {services.map((service) => (
          <div key={service.title} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <button
              className="service-button"
              onClick={() => handleServiceAction(service)}
            >
              {service.button}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Services;