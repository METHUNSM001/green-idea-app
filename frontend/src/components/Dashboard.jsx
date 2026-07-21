
import { isAdminUser } from "../utils/adminUser";

function Dashboard({
  user,
  onLogout,
  onOpenAgriculture,
  onOpenServices,
  language,
  setLanguage,
}) {
  const isTamil = language === "Tamil";
  const uiText = isTamil
    ? {
        eyebrow: "GREEN IDEA தளம்",
        heading: "மீண்டும் வணக்கம்,",
        subtitle: "விவசாய எதிர்காலத்திற்கான சூழல்-அறிவார்ந்த தொழில்நுட்பம்.",
        logout: "வெளியேறு",
        sectionEyebrow: "GREEN IDEA-ஐ ஆராயுங்கள்",
        sectionTitle: "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
        sectionDescription:
          "ஒரே தளத்தில் விவசாயிகள், போக்குவரத்து நிறுவனங்கள், சேவை வழங்குநர்கள் மற்றும் விவசாய வாய்ப்புகளை இணைக்கவும்.",
        features: [
          {
            icon: "🌾",
            title: "ஸ்மார்ட் விவசாயம்",
            description:
              "உங்கள் மண், நீர் கிடைக்கும் தன்மை, நிலப்பரப்பு, வானிலை மற்றும் விவசாய நிலைமைகளின் அடிப்படையில் AI-ஆல் இயக்கப்படும் பயிர் பரிந்துரைகளைப் பெறுங்கள்.",
            button: "விவசாயத்தைத் திற",
            action: onOpenAgriculture,
          },
          {
            icon: "🚚",
            title: "சேவைகள்",
            description:
              "போக்குவரத்து நிறுவனங்கள், விவசாயத் தொழிலாளர்கள், உபகரண வழங்குநர்கள் மற்றும் பிற விவசாய சேவைகளுடன் இணைக்கவும்.",
            button: "சேவைகளைப் பார்க்க & வேலை வாய்ப்புகளை பெறுங்கள்",
            action: onOpenServices,
          },
        ],
        toggle: "English",
      }
    : {
        eyebrow: "GREEN IDEA PLATFORM",
        heading: "Welcome back,",
        subtitle: "Smart technology for a better agricultural future.",
        logout: "LOGOUT",
        sectionEyebrow: "EXPLORE GREEN IDEA",
        sectionTitle: "Choose what you want to do",
        sectionDescription:
          "Connect with farmers, transporters, service providers, and agricultural opportunities in one platform.",
        features: [
          {
            icon: "🌾",
            title: "Smart Farming",
            description:
              "Get AI-powered crop recommendations based on your soil, water availability, land size, weather, and farming conditions.",
            button: "OPEN FARMING",
            action: onOpenAgriculture,
          },
          {
            icon: "🚚",
            title: "Services and Jobs Opportunities",
            description:
              "Connect with transporters, agricultural workers, equipment providers, and other farming services.",
            button: "VIEW SERVICES and GET WORK OPPORTUNITIES",
            action: onOpenServices,
          },
        ],
        toggle: "தமிழ்",
      };

  const features = uiText.features;
  const isAdminAccount = isAdminUser(user);

  return (
    <div className="dashboard-page">

      <div className="dashboard-shell">

        {/* HEADER */}
        <header className="dashboard-header">

          <div className="dashboard-welcome">

            <p className="eyebrow">
              {uiText.eyebrow}
            </p>

            <h2>
              {uiText.heading}{" "}
              <span className="username">
                {user?.username || (isTamil ? "விவசாயி" : "Farmer")}
              </span>
            </h2>

            <p className="dashboard-subtitle">
              {uiText.subtitle}
            </p>

          </div>

          <div className="dashboard-actions">
            <button
              type="button"
              className="lang-toggle"
              onClick={() => setLanguage(isTamil ? "English" : "Tamil")}
            >
              {uiText.toggle}
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={onLogout}
            >
              {uiText.logout}
            </button>
          </div>

        </header>


        {/* FEATURES */}
        <section className="features-section">

          <div className="section-heading">

            <p className="eyebrow">
              {uiText.sectionEyebrow}
            </p>

            <h3>
              {uiText.sectionTitle}
            </h3>

            <p>
              {uiText.sectionDescription}
            </p>

          </div>


          {/* FEATURE CARDS */}
          <div className="feature-grid">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="feature-card"
              >

                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h4>
                  {feature.title}
                </h4>

                <p>
                  {feature.description}
                </p>

                {feature.title === (isTamil ? "சேவைகள்" : "Services") ? (
                  <button
                    type="button"
                    className="feature-button"
                    onClick={feature.action}
                  >
                    {feature.button}
                    <span className="arrow">
                      →
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="feature-button"
                    onClick={feature.action}
                  >

                    {feature.button}

                    <span className="arrow">
                      →
                    </span>

                  </button>
                )}

              </div>

            ))}

          </div>

          {isAdminAccount ? (
            <div className="services-card admin-card admin-card-inline">
              <h4>{isTamil ? "நிர்வாக புலம்" : "Admin Area"}</h4>
              <p>{isTamil ? "போக்குவரத்து வழங்குநர்களை நிர்வகிக்க இந்தப் பகுதியைப் பயன்படுத்தவும்." : "Use this area to manage transport providers."}</p>
              <button type="button" className="service-button" onClick={onOpenServices}>{isTamil ? "நிர்வாகப் பக்கத்திற்கு செல்" : "GO TO ADMIN PAGE"}</button>
            </div>
          ) : null}

        </section>

      </div>

    </div>
  );
}

export default Dashboard;