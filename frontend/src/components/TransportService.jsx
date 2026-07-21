import { useState } from "react";
import { addTransporter, fetchTransporters } from "../api/transportApi";

function TransportService({ onBack, language, setLanguage }) {
  const isTamil = language === "Tamil";
  const [activeTab, setActiveTab] = useState("find");
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ query: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service_type: "",
    vehicle_type: "",
    district: "",
    city: "",
    location: "",
    available: true,
  });
  const [message, setMessage] = useState("");

  const uiText = isTamil
    ? {
        back: "← பின்செல்",
        heading: "🚚 போக்குவரத்து சேவைகள்",
        eyebrow: "போக்குவரத்து",
        findTab: "போக்குவரத்தைத் தேடு",
        registerTab: "போக்குவரத்து பதிவு",
        searchTitle: "போக்குவரத்தைத் தேடுங்கள்",
        searchSubtitle: "உங்கள் மாவட்டம் அல்லது நகரத்தின் பெயரை உள்ளிடவும்",
        registerTitle: "போக்குவரத்து சேவை பதிவு",
        registerSubtitle: "உங்கள் பொக்குவரத்து விவரங்களை சேர்க்கவும்",
        locationQuery: "மாவட்டம் அல்லது நகரம்",
        searchButton: "தேடு",
        noResults: "எந்த வழங்குநர்களும் கிடைக்கவில்லை",
        name: "பெயர்",
        phone: "தொலைபேசி",
        serviceType: "சேவை வகை",
        vehicleType: "வாகன வகை",
        district: "மாவட்டம்",
        city: "நகரம்",
        location: "இடம்",
        available: "கிடைக்கிறது",
        registerButton: "பதிவு செய்",
        callButton: "அழைக்க",
        success: "பதிவு வெற்றிகரமாக செய்யப்பட்டது",
        error: "பதிவு தோல்வியடைந்தது",
        toggle: "English",
      }
    : {
        back: "← BACK",
        heading: "🚚 TRANSPORT SERVICES",
        eyebrow: "TRANSPORT",
        findTab: "FIND TRANSPORT",
        registerTab: "REGISTER TRANSPORT",
        searchTitle: "Search Transport",
        searchSubtitle: "Enter your district or city name",
        registerTitle: "Register Transport Service",
        registerSubtitle: "Add your transport details",
        locationQuery: "District or city",
        searchButton: "SEARCH",
        noResults: "No providers available yet",
        name: "Name",
        phone: "Phone",
        serviceType: "Service type",
        vehicleType: "Vehicle type",
        district: "District",
        city: "City",
        location: "Location",
        available: "Available",
        registerButton: "REGISTER",
        callButton: "CALL",
        success: "Registered successfully",
        error: "Registration failed",
        toggle: "தமிழ்",
      };

  const loadTransporters = async () => {
    setLoading(true);
    try {
      const data = await fetchTransporters(filters);
      setTransporters(data);
    } catch (error) {
      setMessage(error.message || uiText.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadTransporters();
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("greenIdeaToken") || "";
      await addTransporter(formData, token);
      setMessage(uiText.success);
      setFormData({
        name: "",
        phone: "",
        service_type: "",
        vehicle_type: "",
        district: "",
        city: "",
        location: "",
        available: true,
      });
      setActiveTab("find");
      loadTransporters();
    } catch (error) {
      setMessage(error.message || uiText.error);
    }
  };

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
      </section>

      <div className="worker-tabs">
        <button
          className={activeTab === "find" ? "active-tab" : ""}
          onClick={() => setActiveTab("find")}
        >
          {uiText.findTab}
        </button>
        <button
          className={activeTab === "register" ? "active-tab" : ""}
          onClick={() => setActiveTab("register")}
        >
          {uiText.registerTab}
        </button>
      </div>

      {activeTab === "find" ? (
        <section className="services-card search-card">
          <h3>{uiText.searchTitle}</h3>
          <p className="service-description">{uiText.searchSubtitle}</p>
          <form className="filter-form single-search" onSubmit={handleSearch}>
            <input
              value={filters.query}
              onChange={(event) =>
                setFilters({ ...filters, query: event.target.value })
              }
              placeholder={uiText.locationQuery}
            />
            <button className="service-button" type="submit">
              {uiText.searchButton}
            </button>
          </form>
          {message ? (
            <p className="service-description">{message}</p>
          ) : null}
          <div className="transport-list">
            {loading ? (
              <p className="service-description">
                {isTamil ? "தேடுகிறது..." : "Searching..."}
              </p>
            ) : transporters.length ? (
              transporters.map((transporter) => (
                <div className="transport-item" key={transporter.id}>
                  <div>
                    <strong>{transporter.name}</strong>
                    <p>{transporter.service_type}</p>
                    <p>{transporter.vehicle_type}</p>
                  </div>
                  <div>
                    <p>
                      {transporter.city}, {transporter.district}
                    </p>
                    <p>{transporter.location}</p>
                  </div>
                  <div className="transport-actions">
                    <a
                      className="call-button"
                      href={`tel:${transporter.phone}`}
                    >
                      {uiText.callButton}
                    </a>
                    <p>{transporter.phone}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="service-description">{uiText.noResults}</p>
            )}
          </div>
        </section>
      ) : (
        <section className="services-card admin-card">
          <h3>{uiText.registerTitle}</h3>
          <p className="service-description">{uiText.registerSubtitle}</p>
          <form className="admin-form" onSubmit={handleRegister}>
            <input
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder={uiText.name}
            />
            <input
              value={formData.phone}
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
              placeholder={uiText.phone}
            />
            <input
              value={formData.service_type}
              onChange={(event) =>
                setFormData({ ...formData, service_type: event.target.value })
              }
              placeholder={uiText.serviceType}
            />
            <input
              value={formData.vehicle_type}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  vehicle_type: event.target.value,
                })
              }
              placeholder={uiText.vehicleType}
            />
            <input
              value={formData.district}
              onChange={(event) =>
                setFormData({ ...formData, district: event.target.value })
              }
              placeholder={uiText.district}
            />
            <input
              value={formData.city}
              onChange={(event) =>
                setFormData({ ...formData, city: event.target.value })
              }
              placeholder={uiText.city}
            />
            <input
              value={formData.location}
              onChange={(event) =>
                setFormData({ ...formData, location: event.target.value })
              }
              placeholder={uiText.location}
            />
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={() =>
                  setFormData({
                    ...formData,
                    available: !formData.available,
                  })
                }
              />
              {uiText.available}
            </label>
            <button className="service-button" type="submit">
              {uiText.registerButton}
            </button>
          </form>
          {message ? (
            <p className="service-description">{message}</p>
          ) : null}
        </section>
      )}
    </div>
  );
}

export default TransportService;
