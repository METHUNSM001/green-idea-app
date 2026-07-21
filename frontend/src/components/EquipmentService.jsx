import { useState } from "react";
import { fetchEquipment, addEquipment } from "../api/equipmentApi";
import { uploadEquipmentImage } from "../lib/supabaseClient";

const EMPTY_FORM = {
  name: "",
  phone: "",
  equipment_name: "",
  equipment_type: "",
  district: "",
  city: "",
  price: "",
  image_url: "",
  available: true,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB - matches the Supabase bucket's own limit

function EquipmentService({ onBack, language, setLanguage }) {
  const isTamil = language === "Tamil";
  const [activeTab, setActiveTab] = useState("find");
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ query: "" });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
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
        available: "கிடைக்கிறது",
        registerButton: "சேர்க்கவும்",
        uploading: "படம் பதிவேற்றப்படுகிறது...",
        callButton: "அழைக்க",
        success: "உபகரணம் சேர்க்கப்பட்டது",
        error: "தோல்வியடைந்தது",
        dropTitle: "📸 படத்தை இழுத்து விடவும்",
        dropHint: "அல்லது கிளிக் செய்து தேர்ந்தெடுக்கவும் (Max 5MB)",
        remove: "❌ நீக்கவும்",
        tooBig: "படம் 5MB க்கு குறைவாக இருக்க வேண்டும்",
        notImage: "தயவுசெய்து ஒரு படம் தேர்ந்தெடுக்கவும்",
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
        available: "Available",
        registerButton: "ADD",
        uploading: "Uploading image...",
        callButton: "CALL",
        success: "Equipment added successfully",
        error: "Registration failed",
        dropTitle: "📸 Drop image here",
        dropHint: "or click to select (Max 5MB)",
        remove: "❌ Remove",
        tooBig: "Image must be less than 5MB",
        notImage: "Please select an image file",
        toggle: "தமிழ்",
      };

  const updateField = (field) => (event) =>
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await fetchEquipment({ city: filters.query });
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
    const file = event.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleImageFileInput = (event) => {
    const file = event.target.files?.[0];
    if (file) processImageFile(file);
  };

  const processImageFile = (file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      setMessage(uiText.tooBig);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMessage(uiText.notImage);
      return;
    }
    setMessage("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        setMessage(uiText.uploading);
        imageUrl = await uploadEquipmentImage(imageFile);
      }

      await addEquipment({ ...formData, image_url: imageUrl });

      setMessage(uiText.success);
      setFormData(EMPTY_FORM);
      clearImage();
      setActiveTab("find");
    } catch (error) {
      setMessage(error.message || uiText.error);
    } finally {
      setSubmitting(false);
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
              onChange={(event) => setFilters({ ...filters, query: event.target.value })}
              placeholder={uiText.locationQuery}
              aria-label={uiText.locationQuery}
            />
            <button className="service-button" type="submit" disabled={loading}>
              {uiText.searchButton}
            </button>
          </form>
          {message ? <p className="service-description">{message}</p> : null}
          <div className="transport-list">
            {loading ? (
              <p className="service-description">{isTamil ? "தேடுகிறது..." : "Searching..."}</p>
            ) : equipment.length ? (
              equipment.map((item) => (
                <div className="transport-item" key={item.id}>
                  {item.image_url ? (
                    <img className="equipment-thumb" src={item.image_url} alt={item.equipment_name} />
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
                    {item.price ? <p>{isTamil ? `₹${item.price}/நா` : `₹${item.price}/day`}</p> : null}
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
            <input value={formData.name} onChange={updateField("name")} placeholder={uiText.name} required />
            <input value={formData.phone} onChange={updateField("phone")} placeholder={uiText.phone} required />
            <input
              value={formData.equipment_name}
              onChange={updateField("equipment_name")}
              placeholder={uiText.equipmentName}
              required
            />
            <input
              value={formData.equipment_type}
              onChange={updateField("equipment_type")}
              placeholder={uiText.equipmentType}
              required
            />
            <input value={formData.district} onChange={updateField("district")} placeholder={uiText.district} required />
            <input value={formData.city} onChange={updateField("city")} placeholder={uiText.city} required />
            <input value={formData.price} onChange={updateField("price")} placeholder={uiText.price} />

            <div
              className={`image-drop-zone${dragActive ? " drag-active" : ""}`}
              onDragEnter={handleImageDrag}
              onDragLeave={handleImageDrag}
              onDragOver={handleImageDrag}
              onDrop={handleImageDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileInput}
                id="image-input"
                hidden
              />
              <label htmlFor="image-input" className="image-drop-zone-label">
                <p className="image-drop-zone-title">{uiText.dropTitle}</p>
                <p className="image-drop-zone-hint">{uiText.dropHint}</p>
              </label>
            </div>

            {imagePreview ? (
              <div className="image-preview-wrap">
                <img src={imagePreview} alt="Equipment preview" />
                <br />
                <button type="button" className="image-preview-remove" onClick={clearImage}>
                  {uiText.remove}
                </button>
              </div>
            ) : null}

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={() => setFormData((prev) => ({ ...prev, available: !prev.available }))}
              />
              {uiText.available}
            </label>

            <button className="service-button" type="submit" disabled={submitting}>
              {submitting ? uiText.uploading : uiText.registerButton}
            </button>
          </form>
          {message ? <p className="service-description">{message}</p> : null}
        </section>
      )}
    </div>
  );
}

export default EquipmentService;
