import { useState } from "react";
import "../App.css";

function EquipmentService({ onBack, language, setLanguage }) {
  const isTamil = language === "Tamil";
  const [activeTab, setActiveTab] = useState("find");
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ query: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    equipment_name: "",
    equipment_type: "",
    district: "",
    city: "",
    price: "",
    image_url: "",
    available: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState("");

  const uiText = isTamil
    ? {
        back: "← பின்செல்",
        heading: "🚜 உபகரண வாடகை",
        eyebrow: "உபகரணங்கள்",
        findTab: "உபகரணத்தைத் தேடு",
        registerTab: "உபகரணம் சேர்க்கவும்",
        searchTitle: "உபகரணத்தைத் தேடுங்கள்",
        searchSubtitle: "உங்கள் நகரத்தின் பெயரை உள்ளிடவும்",
        registerTitle: "உபகரணம் சேர்க்கவும்",
        registerSubtitle: "உங்கள் உபகரணங்களின் விவரங்களை சேர்க்கவும்",
        locationQuery: "நகரம் அல்லது மாவட்டம்",
        searchButton: "தேடு",
        noResults: "எந்த உபகரணங்களும் கிடைக்கவில்லை",
        name: "உரிமையாளர் பெயர்",
        phone: "தொலைபேசி",
        equipmentName: "உபகரணத்தின் பெயர்",
        equipmentType: "உபகரண வகை",
        district: "மாவட்டம்",
        city: "நகரம்",
        price: "விலை / நாள்",
        imageUrl: "படம் URL",
        available: "கிடைக்கிறது",
        registerButton: "சேர்க்கவும்",
        callButton: "அழைக்க",
        success: "உபகரணம் சேர்க்கப்பட்டது",
        error: "தோல்வியடைந்தது",
        toggle: "English",
      }
    : {
        back: "← BACK",
        heading: "🚜 EQUIPMENT RENTAL",
        eyebrow: "EQUIPMENT",
        findTab: "FIND EQUIPMENT",
        registerTab: "ADD EQUIPMENT",
        searchTitle: "Search Equipment",
        searchSubtitle: "Enter your city or district",
        registerTitle: "Register Equipment",
        registerSubtitle: "Add your equipment details with image",
        locationQuery: "City or district",
        searchButton: "SEARCH",
        noResults: "No equipment available yet",
        name: "Owner Name",
        phone: "Phone",
        equipmentName: "Equipment Name",
        equipmentType: "Equipment Type",
        district: "District",
        city: "City",
        price: "Price / Day",
        imageUrl: "Image URL",
        available: "Available",
        registerButton: "ADD",
        callButton: "CALL",
        success: "Equipment added successfully",
        error: "Registration failed",
        toggle: "தமிழ்",
      };

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) {
        params.append("city", filters.query);
      }
      const response = await fetch(
        `http://127.0.0.1:5000/api/services/equipment?${params.toString()}`
      );
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      setMessage(error.message || uiText.error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleImageDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const files = event.dataTransfer.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleImageFileInput = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const processImageFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setMessage(
        isTamil
          ? "படம் 5MB க்கு குறைவாக இருக்க வேண்டும்"
          : "Image must be less than 5MB"
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage(
        isTamil
          ? "தயவுசெய்து ஒரு படம் தேர்ந்தெடுக்கவும்"
          : "Please select an image file"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setFormData({ ...formData, image_url: e.target.result });
      setMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/services/equipment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(uiText.success);
      setFormData({
        name: "",
        phone: "",
        equipment_name: "",
        equipment_type: "",
        district: "",
        city: "",
        price: "",
        image_url: "",
        available: true,
      });
      setImagePreview(null);
      setActiveTab("find");
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
            ) : equipment.length ? (
              equipment.map((item) => (
                <div className="transport-item" key={item.id}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.equipment_name}
                      style={{
                        maxWidth: "120px",
                        maxHeight: "120px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : null}
                  <div>
                    <strong>{item.equipment_name}</strong>
                    <p>{item.equipment_type}</p>
                    <p>
                      {item.city}, {item.district}
                    </p>
                  </div>
                  <div className="transport-actions">
                    <a className="call-button" href={`tel:${item.phone}`}>
                      {uiText.callButton}
                    </a>
                    <p>{item.phone}</p>
                    {item.price ? (
                      <p>
                        {isTamil
                          ? `₹${item.price}/நா`
                          : `₹${item.price}/day`}
                      </p>
                    ) : null}
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
              value={formData.equipment_name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  equipment_name: event.target.value,
                })
              }
              placeholder={uiText.equipmentName}
            />
            <input
              value={formData.equipment_type}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  equipment_type: event.target.value,
                })
              }
              placeholder={uiText.equipmentType}
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
              value={formData.price}
              onChange={(event) =>
                setFormData({ ...formData, price: event.target.value })
              }
              placeholder={uiText.price}
            />
            <div
              className="image-drop-zone"
              onDragEnter={handleImageDrag}
              onDragLeave={handleImageDrag}
              onDragOver={handleImageDrag}
              onDrop={handleImageDrop}
              style={{
                border: dragActive ? "2px solid #4CAF50" : "2px dashed #999",
                padding: "20px",
                textAlign: "center",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: dragActive ? "#e8f5e9" : "#f9f9f9",
                transition: "all 0.3s ease",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileInput}
                style={{ display: "none" }}
                id="image-input"
              />
              <label htmlFor="image-input" style={{ cursor: "pointer" }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
                  {isTamil ? "📸 படத்தை இழுத்து விடவும்" : "📸 Drop image here"}
                </p>
                <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                  {isTamil
                    ? "அல்லது கிளிக் செய்து தேர்ந்தெடுக்கவும் (Max 5MB)"
                    : "or click to select (Max 5MB)"}
                </p>
              </label>
            </div>
            {imagePreview ? (
              <div
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Equipment preview"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    borderRadius: "8px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image_url: "" });
                  }}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isTamil ? "❌ நீக்கவும்" : "❌ Remove"}
                </button>
              </div>
            ) : null}
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

export default EquipmentService;
