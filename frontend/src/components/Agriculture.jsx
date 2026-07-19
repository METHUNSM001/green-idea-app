import { useEffect, useState } from "react";
import "../App.css";

function Agriculture({ onBack, language, setLanguage }) {
  const [activeTab, setActiveTab] =
    useState("recommendation");

  const [formData, setFormData] = useState({
    last_sown_crop: "",
    soil_type: "",
    soil_ph: "",
    soil_minerals: "",
    water_availability: "",
    watering_days: "",
    watering_hours: "",
    land_size: "",
    land_unit: "acres",
    budget: "",
    district: "",
    season: "",
    preferred_language: "English",
  });

  const [recommendation, setRecommendation] =
    useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem("greenIdeaReminders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [reminderText, setReminderText] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] =
    useState(false);

  const isTamil = language === "Tamil";

  const uiText = isTamil
    ? {
        back: "← பின்செல்",
        tabs: {
          recommendation: "🌾 பயிர் பரிந்துரை",
          weather: "🌦️ வானிலை",
          chat: "🤖 AI விவசாய உதவியாளர்",
        },
        heroTitle: "AI பயிர் பரிந்துரை",
        heroSubtitle:
          "உங்கள் பண்ணையின் விவரங்களை உள்ளிடவும், AI-ஆல் தெளிவான பரிந்துரையைப் பெறவும்.",
        form: {
          lastSownCrop: "கடைசியாக விதைத்த பயிர்",
          soilType: "மண்ணின் வகை",
          soilPh: "மண் pH",
          soilMinerals: "மண் தாது",
          waterAvailability: "நீரின் கிடைக்கும் தன்மை",
          wateringDays: "வாரத்திற்கு நீர் அளிக்கும் நாட்கள்",
          wateringHours: "தினமும் நீர் அளிக்கும் மணி",
          landSize: "நிலப்பரப்பு",
          landUnit: "நிலப்பரப்பு அலகு",
          budget: "பட்ஜெட் ₹",
          district: "மாவட்டம் / நகரம்",
          season: "பருவம்",
          preferredLanguage: "விருப்ப மொழி",
        },
        placeholders: {
          lastSownCrop: "உதாரணம்: நெல்",
          soilPh: "உதாரணம்: 6.5",
          soilMinerals: "உதாரணம்: NPK",
          landSize: "உதாரணம்: 2",
          district: "உதாரணம்: ஈரோடு",
        },
        button: {
          loading: "தரவை பகுப்பாய்வு செய்கிறது...",
          ready: "🤖 AI பரிந்துரையைப் பெறு",
        },
        resultHeading: "🌾 பரிந்துரைக்கப்பட்ட விவசாயத் திட்டம்",
        metrics: {
          crop: "பரிந்துரைக்கப்பட்ட பயிர்",
          sowing: "விதைப்பு நேரம்",
          harvest: "அறுவடை காலம்",
        },
        plans: {
          maintenance: "🌱 பராமரிப்பு திட்டம்",
          watering: "💧 நீர்ப்பாசன திட்டம்",
          explanation: "🧠 AI விளக்கம்",
        },
        weatherTitle: "🌦️ வானிலை முன்னறிவு",
        weatherSubtitle:
          "உங்கள் மாவட்டத்திற்கான அடுத்த நாட்களின் மழை, வெப்பம் மற்றும் விவசாய வழிகாட்டுதலைப் பார்க்கவும்.",
        weatherSearchPlaceholder: "மாவட்டம் அல்லது இடத்தை உள்ளிடவும்",
        weatherButton: "வானிலை சரிபார்",
        weatherSummaryHeading: "இன்று மற்றும் அடுத்த நாள்",
        weatherAlertHeading: "மழை & எச்சரிக்கைகள்",
        chatTitle: "🤖 AI விவசாய உதவியாளர்",
        chatSubtitle:
          "தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள். பாசனம், உரம், மழை மற்றும் பூச்சி மேலாண்மைக்கான ஆலோசனைகளைப் பெறலாம்.",
        chatWelcome:
          "உங்கள் மொழியைத் தேர்ந்தெடுத்து, ஆலோசனை கேளுங்கள். உதவியாளர் உங்கள் தேர்ந்தெடுத்த மொழியில் பதிலளிக்கும்.",
        chatInputPlaceholder:
          "உரம், நீர்ப்பாசனம், நோய் அல்லது வானிலை பற்றி கேளுங்கள்...",
        chatButton: "கேள்",
        remindersTitle: "🕒 நினைவூட்டல்கள்",
        reminderTextPlaceholder: "நீர் வைக்க / உரமிட / பூச்சிகளை சரிபார்க்க",
        reminderButton: "சேர்",
        reminderEmpty: "எந்த நினைவூட்டல்களும் இன்னும் சேர்க்கப்படவில்லை.",
        delivered: "வழங்கப்பட்டது",
        scheduled: "திட்டமிடப்பட்டது",
      }
    : {
        back: "← BACK",
        tabs: {
          recommendation: "🌾 CROP RECOMMENDATION",
          weather: "🌦️ WEATHER",
          chat: "🤖 AI FARMING ASSISTANT",
        },
        heroTitle: "AI Crop Recommendation",
        heroSubtitle:
          "Enter your farm details to get a clear and practical crop recommendation.",
        form: {
          lastSownCrop: "Last Sown Crop",
          soilType: "Soil Type",
          soilPh: "Soil pH",
          soilMinerals: "Soil Minerals",
          waterAvailability: "Water Availability",
          wateringDays: "Watering Days Per Week",
          wateringHours: "Watering Hours Per Day",
          landSize: "Land Size",
          landUnit: "Land Unit",
          budget: "Budget ₹",
          district: "District / Location",
          season: "Season",
          preferredLanguage: "Preferred Language",
        },
        placeholders: {
          lastSownCrop: "Example: Paddy",
          soilPh: "Example: 6.5",
          soilMinerals: "Example: NPK",
          landSize: "Example: 2",
          district: "Example: Erode",
        },
        button: {
          loading: "ANALYZING FARM DATA...",
          ready: "🤖 GET AI RECOMMENDATION",
        },
        resultHeading: "🌾 Recommended Farming Plan",
        metrics: {
          crop: "Recommended Crop",
          sowing: "Sowing Time",
          harvest: "Harvest Duration",
        },
        plans: {
          maintenance: "🌱 Maintenance Plan",
          watering: "💧 Watering Plan",
          explanation: "🧠 AI Explanation",
        },
        weatherTitle: "🌦️ Weather Forecast",
        weatherSubtitle:
          "See the next forecast, rain alerts, and daily farming guidance for your district.",
        weatherSearchPlaceholder: "Enter district or location",
        weatherButton: "CHECK WEATHER",
        weatherSummaryHeading: "Today and next day",
        weatherAlertHeading: "Rain & Alerts",
        chatTitle: "🤖 AI Farming Assistant",
        chatSubtitle:
          "Ask in Tamil or English. The assistant can guide you on irrigation, fertilizers, rain alerts, and crop care.",
        chatWelcome:
          "Choose your language and ask for advice. The assistant will respond in your selected language.",
        chatInputPlaceholder:
          "Ask about fertilizer, irrigation, disease, or weather...",
        chatButton: "ASK",
        remindersTitle: "🕒 Reminders",
        reminderTextPlaceholder: "Water plants / fertilize / inspect pests",
        reminderButton: "ADD",
        reminderEmpty: "No reminders added yet.",
        delivered: "Delivered",
        scheduled: "Scheduled",
      };

  const buildContentBlocks = (content) => {
    if (content === null || content === undefined) {
      return [];
    }

    const text = String(content).replace(/\r/g, "").trim();
    if (!text) {
      return [];
    }

    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const renderContentBlocks = (content) => {
    const blocks = buildContentBlocks(content);

    if (!blocks.length) {
      return null;
    }

    return (
      <div className="content-blocks">
        {blocks.map((block, index) => (
          <p key={`${block}-${index}`}>{block}</p>
        ))}
      </div>
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const getRecommendation = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/agriculture/recommend",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Recommendation failed");
      }

      setRecommendation(data);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to get recommendation");
    } finally {
      setLoading(false);
    }
  };

  const getWeather = async () => {
    setWeatherLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/agriculture/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: formData.district || "Coimbatore" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Weather fetch failed");
      }
      setWeather(data);
    } catch (error) {
      alert(error.message || "Unable to fetch weather");
    } finally {
      setWeatherLoading(false);
    }
  };

  const askAssistant = async (event) => {
    event.preventDefault();
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/agriculture/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput, language }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Assistant failed");
      }
      setChatReply(data.reply || "");
      setChatInput("");
    } catch (error) {
      setChatReply(error.message || "Assistant unavailable");
    } finally {
      setChatLoading(false);
    }
  };

  const addReminder = (event) => {
    event.preventDefault();
    if (!reminderText || !reminderDate || !reminderTime) return;
    const newReminder = {
      id: Date.now(),
      text: reminderText,
      date: reminderDate,
      time: reminderTime,
      language,
    };
    const nextReminders = [newReminder, ...reminders];
    setReminders(nextReminders);
    localStorage.setItem("greenIdeaReminders", JSON.stringify(nextReminders));
    setReminderText("");
    setReminderDate("");
    setReminderTime("");
  };

  const removeReminder = (id) => {
    const nextReminders = reminders.filter((item) => item.id !== id);
    setReminders(nextReminders);
    localStorage.setItem("greenIdeaReminders", JSON.stringify(nextReminders));
  };

  useEffect(() => {
    getWeather();
  }, []);

  useEffect(() => {
    const nextPreferredLanguage = language === "Tamil" ? "Tamil" : "English";

    setFormData((previousData) => {
      if (previousData.preferred_language === nextPreferredLanguage) {
        return previousData;
      }

      return {
        ...previousData,
        preferred_language: nextPreferredLanguage,
      };
    });
  }, [language]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    if (!reminders.length) return;

    const interval = setInterval(() => {
      const now = new Date();

      setReminders((currentReminders) => {
        const updated = currentReminders.map((item) => {
          const scheduledAt = new Date(`${item.date}T${item.time}`);
          if (item.notified || scheduledAt > now) return item;

          const message = item.language === "Tamil"
            ? `நீங்கள் திட்டமிட்டReminder: ${item.text}`
            : `Reminder: ${item.text}`;

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Green Idea Reminder", { body: message });
          } else {
            alert(message);
          }

          return { ...item, notified: true };
        });

        localStorage.setItem("greenIdeaReminders", JSON.stringify(updated));
        return updated;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="agriculture-page">
      <nav className="agriculture-navbar">
        <button className="back-button" onClick={onBack}>
          {uiText.back}
        </button>

        <h2>🌱 SMART AGRICULTURE</h2>

        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLanguage(isTamil ? "English" : "Tamil")}
        >
          {isTamil ? "English" : "தமிழ்"}
        </button>
      </nav>

      <div className="agriculture-tabs">
        <button
          className={activeTab === "recommendation" ? "active-tab" : ""}
          onClick={() => setActiveTab("recommendation")}
        >
          {uiText.tabs.recommendation}
        </button>

        <button
          className={activeTab === "weather" ? "active-tab" : ""}
          onClick={() => setActiveTab("weather")}
        >
          {uiText.tabs.weather}
        </button>

        <button
          className={activeTab === "chat" ? "active-tab" : ""}
          onClick={() => setActiveTab("chat")}
        >
          {uiText.tabs.chat}
        </button>
      </div>

      {activeTab === "recommendation" && (
        <main className="agriculture-content">
          <h1>{uiText.heroTitle}</h1>
          <p className="section-subtitle">{uiText.heroSubtitle}</p>

          <form className="farmer-form" onSubmit={getRecommendation}>
            <div className="form-group">
              <label>{uiText.form.lastSownCrop}</label>
              <input
                name="last_sown_crop"
                value={formData.last_sown_crop}
                onChange={handleChange}
                placeholder={uiText.placeholders.lastSownCrop}
              />
            </div>

            <div className="form-group">
              <label>{uiText.form.soilType}</label>
              <select name="soil_type" value={formData.soil_type} onChange={handleChange} required>
                <option value="">{isTamil ? "மண்ணின் வகையைத் தேர்ந்தெடுக்கவும்" : "Select Soil Type"}</option>
                <option value="Red Soil">{isTamil ? "சிவப்பு மண்" : "Red Soil"}</option>
                <option value="Black Soil">{isTamil ? "கருப்பு மண்" : "Black Soil"}</option>
                <option value="Alluvial Soil">{isTamil ? "வண்டல் மண்" : "Alluvial Soil"}</option>
                <option value="Sandy Soil">{isTamil ? "மணல் மண்" : "Sandy Soil"}</option>
                <option value="Clay Soil">{isTamil ? "களிமண்" : "Clay Soil"}</option>
                <option value="Loamy Soil">{isTamil ? "இலோமி மண்" : "Loamy Soil"}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{uiText.form.soilPh}</label>
              <input
                name="soil_ph"
                type="number"
                step="0.1"
                value={formData.soil_ph}
                onChange={handleChange}
                placeholder={uiText.placeholders.soilPh}
              />
            </div>

            <div className="form-group">
              <label>{uiText.form.soilMinerals}</label>
              <input
                name="soil_minerals"
                value={formData.soil_minerals}
                onChange={handleChange}
                placeholder={uiText.placeholders.soilMinerals}
              />
            </div>

            <div className="form-group">
              <label>{uiText.form.waterAvailability}</label>
              <select name="water_availability" value={formData.water_availability} onChange={handleChange} required>
                <option value="">{isTamil ? "நீரின் அளவைத் தேர்ந்தெடுக்கவும்" : "Select Water Availability"}</option>
                <option value="High">{isTamil ? "அதிகம்" : "High"}</option>
                <option value="Medium">{isTamil ? "நடுத்தரம்" : "Medium"}</option>
                <option value="Low">{isTamil ? "குறைவு" : "Low"}</option>
                <option value="Rainfed">{isTamil ? "மழை சார்ந்தது" : "Rainfed"}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{uiText.form.wateringDays}</label>
              <input name="watering_days" type="number" min="0" max="7" value={formData.watering_days} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>{uiText.form.wateringHours}</label>
              <input name="watering_hours" type="number" min="0" value={formData.watering_hours} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>{uiText.form.landSize}</label>
              <input
                name="land_size"
                type="number"
                step="0.01"
                value={formData.land_size}
                onChange={handleChange}
                placeholder={uiText.placeholders.landSize}
                required
              />
            </div>

            <div className="form-group">
              <label>{uiText.form.landUnit}</label>
              <select name="land_unit" value={formData.land_unit} onChange={handleChange}>
                <option value="acres">{isTamil ? "ஏக்கர்" : "Acres"}</option>
                <option value="hectares">{isTamil ? "எக்டேர்" : "Hectares"}</option>
                <option value="cents">{isTamil ? "சென்ட்ஸ்" : "Cents"}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{uiText.form.budget}</label>
              <input name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="50000" />
            </div>

            <div className="form-group">
              <label>{uiText.form.district}</label>
              <input name="district" value={formData.district} onChange={handleChange} placeholder={uiText.placeholders.district} />
            </div>

            <div className="form-group">
              <label>{uiText.form.season}</label>
              <select name="season" value={formData.season} onChange={handleChange}>
                <option value="">{isTamil ? "பருவத்தைத் தேர்ந்தெடுக்கவும்" : "Select Season"}</option>
                <option value="Summer">{isTamil ? "கோடை" : "Summer"}</option>
                <option value="Monsoon">{isTamil ? "மழைக்காலம்" : "Monsoon"}</option>
                <option value="Winter">{isTamil ? "குளிர்காலம்" : "Winter"}</option>
                <option value="Year Round">{isTamil ? "முழு ஆண்டு" : "Year Round"}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{uiText.form.preferredLanguage}</label>
              <select name="preferred_language" value={formData.preferred_language} onChange={handleChange}>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <button type="submit" className="recommend-button" disabled={loading}>
              {loading ? uiText.button.loading : uiText.button.ready}
            </button>
          </form>

          {recommendation && (
            <div className="recommendation-result">
              <h2>{uiText.resultHeading}</h2>

              <div className="recommendation-grid">
                <div className="result-box">
                  <span>{uiText.metrics.crop}</span>
                  <strong>{recommendation.recommended_crop || "—"}</strong>
                </div>

                <div className="result-box">
                  <span>{uiText.metrics.sowing}</span>
                  <strong>{recommendation.sowing_time || "—"}</strong>
                </div>

                <div className="result-box">
                  <span>{uiText.metrics.harvest}</span>
                  <strong>{recommendation.harvest_duration || "—"}</strong>
                </div>
              </div>

              <div className="plan-section">
                <h3>{uiText.plans.maintenance}</h3>
                {renderContentBlocks(recommendation.maintenance_plan)}
              </div>

              <div className="plan-section">
                <h3>{uiText.plans.watering}</h3>
                {renderContentBlocks(recommendation.watering_plan)}
              </div>

              <div className="plan-section">
                <h3>{uiText.plans.explanation}</h3>
                {renderContentBlocks(recommendation.reasoning)}
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === "weather" && (
        <main className="agriculture-content">
          <h1>{uiText.weatherTitle}</h1>
          <p className="section-subtitle">{uiText.weatherSubtitle}</p>

          <div className="weather-search">
            <input value={formData.district} onChange={handleChange} name="district" placeholder={uiText.weatherSearchPlaceholder} />
            <button type="button" className="location-button" onClick={getWeather}>
              {uiText.weatherButton}
            </button>
          </div>

          {weatherLoading && <div className="loading-box">{isTamil ? "வானிலை ஏற்றப்படுகிறது..." : "Loading weather..."}</div>}

          {weather && (
            <>
              <div className="weather-dashboard">
                <div className="weather-main-card">
                  <h2>{weather.city}</h2>
                  <div className="weather-temperature">{Math.round(weather.summary?.temp || 0)}°C</div>
                  <p>{weather.summary?.description || (isTamil ? "வானிலை தரவு கிடைக்கிறது" : "Forecast available")}</p>
                  <p>{isTamil ? `ஈரப்பதம்: ${weather.summary?.humidity || "-"}%` : `Humidity: ${weather.summary?.humidity || "-"}%`}</p>
                  <p>{isTamil ? `காற்று: ${weather.summary?.wind || "-"} m/s` : `Wind: ${weather.summary?.wind || "-"} m/s`}</p>
                </div>
                <div className="weather-info-card">
                  <h3>{uiText.weatherAlertHeading}</h3>
                  {weather.alerts?.length ? weather.alerts.map((alert) => <p key={alert}>{alert}</p>) : <p>{isTamil ? "முக்கிய மழை எச்சரிக்கை இல்லை." : "No major rain alerts."}</p>}
                </div>
              </div>

              <div className="recommendation-result">
                <h2>{uiText.weatherSummaryHeading}</h2>
                <div className="recommendation-grid">
                  {(() => {
                    const grouped = (weather.forecast || []).reduce((days, item) => {
                      const dateKey = item.time.split(" ")[0];
                      if (!days[dateKey]) {
                        days[dateKey] = [];
                      }
                      days[dateKey].push(item);
                      return days;
                    }, {});

                    return Object.entries(grouped)
                      .slice(0, 6)
                      .map(([date, items]) => {
                        const first = items[0] || {};
                        const temps = items.map((entry) => entry.temp || 0);
                        const maxTemp = Math.max(...temps);
                        const minTemp = Math.min(...temps);
                        const rainChance = Math.max(...items.map((entry) => entry.rain_prob || 0));
                        return (
                          <div className="result-box" key={date}>
                            <span>{date}</span>
                            <strong>{Math.round(maxTemp)}°C / {Math.round(minTemp)}°C</strong>
                            <p>{first.description || (isTamil ? "வானிலை தரவு கிடைக்கிறது" : "Forecast available")}</p>
                            <p>{isTamil ? `மழை: ${rainChance}%` : `Rain: ${rainChance}%`}</p>
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {activeTab === "chat" && (
        <main className="agriculture-content">
          <h1>{uiText.chatTitle}</h1>
          <p className="section-subtitle">{uiText.chatSubtitle}</p>

          <div className="chat-container">
            <div className="chat-welcome">{uiText.chatWelcome}</div>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="language-select">
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
            </select>
            <form className="chat-form" onSubmit={askAssistant}>
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={uiText.chatInputPlaceholder} />
              <button type="submit" disabled={chatLoading}>
                {chatLoading ? (isTamil ? "சிந்திக்கிறது..." : "Thinking...") : uiText.chatButton}
              </button>
            </form>
            {chatReply && <div className="chat-answer">{chatReply}</div>}
          </div>

          <div className="reminder-form-block">
            <h3>{uiText.remindersTitle}</h3>
            <form className="reminder-form" onSubmit={addReminder}>
              <input value={reminderText} onChange={(event) => setReminderText(event.target.value)} placeholder={uiText.reminderTextPlaceholder} />
              <input value={reminderDate} onChange={(event) => setReminderDate(event.target.value)} type="date" />
              <input value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} type="time" />
              <button type="submit">{uiText.reminderButton}</button>
            </form>
            <div className="reminder-list">
              {reminders.length ? reminders.map((item) => (
                <div className="reminder-item" key={item.id}>
                  <div>
                    <strong>{item.text}</strong>
                    <p>{isTamil ? `${uiText.scheduled} ${item.date} ${isTamil ? "மணி" : "at"} ${item.time}` : `Scheduled for ${item.date} at ${item.time}`}</p>
                    {item.notified && <p className="success-message">{uiText.delivered}</p>}
                  </div>
                  <button type="button" onClick={() => removeReminder(item.id)}>
                    {isTamil ? "நீக்கு" : "Remove"}
                  </button>
                </div>
              )) : <p className="empty-state">{uiText.reminderEmpty}</p>}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Agriculture;