import { useMemo, useState } from "react";
import { addWorker, fetchWorkers } from "../api/workersApi";

function Workers({ onBack, language, setLanguage }) {
  const isTamil = language === "Tamil";
  const [activeTab, setActiveTab] = useState("find");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", age: "", city: "", district: "", panchayat: "", phone: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [copiedPhone, setCopiedPhone] = useState("");

  const uiText = useMemo(
    () =>
      isTamil
        ? {
            back: "← பின்செல்",
        heading: "👨‍🌾 தொழிலாளர் சேவைகள்",
        eyebrow: "வேலைவாய்ப்பு",
        subtitle: "வேலைக்காகத் தேடும் தொழிலாளர்கள் பட்டியலைப் பார்க்கவும் மற்றும் அவர்களை தொடர்பு கொள்ளவும்.",
        findTab: "தொழிலாளர்களைத் தேடு",
        registerTab: "தொழிலாளர் பதிவு",
        panchayatPlaceholder: "பஞ்சாயத்து பெயரை உள்ளிடவும்",
        searchButton: "தேடு",
        noResults: "இந்த பஞ்சாயத்தில் இன்னும் தொழிலாளர்கள் பதிவு செய்யப்படவில்லை.",
        name: "பெயர்",
        age: "வயது",
        city: "நகரம்",
        district: "மாவட்டம்",
        panchayat: "பஞ்சாயத்து",
        phone: "தொலைபேசி",
        registerButton: "பதிவு செய்",
        callButton: "அழைக்க",
        copyHint: "எண் நகலெடுக்கப்பட்டது",
        success: "தொழிலாளர் பதிவு செய்யப்பட்டார்",
        error: "பதிவு தோல்வியடைந்தது",
      }
    : {
        back: "← BACK",
        heading: "👨‍🌾 WORKER SERVICES",
        eyebrow: "EMPLOYMENT",
        subtitle: "Find registered workers for farm work and contact them quickly.",
        findTab: "FIND WORKERS",
        registerTab: "REGISTER WORKER",
        panchayatPlaceholder: "Enter panchayat",
        searchButton: "SEARCH",
        noResults: "No workers registered for this panchayat yet.",
        name: "Name",
        age: "Age",
        city: "City",
        district: "District",
        panchayat: "Panchayat",
        phone: "Phone",
        registerButton: "REGISTER",
        callButton: "CALL",
        copyHint: "Phone copied to clipboard",
        success: "Worker registered successfully",
        error: "Unable to register worker",
      },
    [isTamil]
  );

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await fetchWorkers({ panchayat: search });
      setWorkers(data);
      if (!data.length) {
        setMessage(uiText.noResults);
      }
    } catch (error) {
      setMessage(error.message || uiText.error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await addWorker(formData);
      setMessage(uiText.success);
      setFormData({ name: "", age: "", city: "", district: "", panchayat: "", phone: "" });
      setActiveTab("find");
    } catch (error) {
      setMessage(error.message || uiText.error);
    }
  };

  const handleCall = async (phone) => {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(""), 1500);
    } finally {
      window.open(`tel:${phone}`, "_self");
    }
  };

  const workerCards = useMemo(() => workers.map((worker) => (
    <div className="worker-card" key={worker.id}>
      <div>
        <strong>{worker.name}</strong>
        <p>{worker.age} yrs</p>
      </div>
      <div>
        <p>{worker.city}, {worker.district}</p>
        <p>{worker.panchayat}</p>
      </div>
      <div className="worker-actions">
        <button type="button" className="call-button" onClick={() => handleCall(worker.phone)}>{uiText.callButton}</button>
        <span>{copiedPhone === worker.phone ? uiText.copyHint : worker.phone}</span>
      </div>
    </div>
  )), [workers, copiedPhone, uiText]);

  return (
    <div className="services-page">
      <nav className="services-navbar">
        <button className="back-button" onClick={onBack}>{uiText.back}</button>
        <h2>{uiText.heading}</h2>
        <button type="button" className="lang-toggle" onClick={() => setLanguage(isTamil ? "English" : "Tamil")}>{isTamil ? "English" : "தமிழ்"}</button>
      </nav>

      <section className="services-header">
        <p className="eyebrow">{uiText.eyebrow}</p>
        <h1>{uiText.heading}</h1>
        <p>{uiText.subtitle}</p>
      </section>

      <div className="worker-tabs">
        <button className={activeTab === "find" ? "active-tab" : ""} onClick={() => setActiveTab("find")}>{uiText.findTab}</button>
        <button className={activeTab === "register" ? "active-tab" : ""} onClick={() => setActiveTab("register")}>{uiText.registerTab}</button>
      </div>

      {activeTab === "find" ? (
        <section className="services-card search-card">
          <form className="filter-form single-search" onSubmit={handleSearch}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={uiText.panchayatPlaceholder} />
            <button className="service-button" type="submit">{uiText.searchButton}</button>
          </form>
          {message ? <p className="service-description">{message}</p> : null}
          <div className="transport-list">
            {loading ? <p className="service-description">{isTamil ? "தேடுகிறது..." : "Searching..."}</p> : workerCards.length ? workerCards : null}
          </div>
        </section>
      ) : (
        <section className="services-card admin-card">
          <form className="admin-form" onSubmit={handleRegister}>
            <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder={uiText.name} />
            <input value={formData.age} onChange={(event) => setFormData({ ...formData, age: event.target.value })} placeholder={uiText.age} />
            <input value={formData.city} onChange={(event) => setFormData({ ...formData, city: event.target.value })} placeholder={uiText.city} />
            <input value={formData.district} onChange={(event) => setFormData({ ...formData, district: event.target.value })} placeholder={uiText.district} />
            <input value={formData.panchayat} onChange={(event) => setFormData({ ...formData, panchayat: event.target.value })} placeholder={uiText.panchayat} />
            <input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder={uiText.phone} />
            <button className="service-button" type="submit">{uiText.registerButton}</button>
          </form>
          {message ? <p className="service-description">{message}</p> : null}
        </section>
      )}
    </div>
  );
}

export default Workers;
