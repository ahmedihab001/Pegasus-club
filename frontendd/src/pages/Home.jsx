import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const features = [
    {
      icon: "🏆",
      title: "World-Class Facilities",
      desc: "State-of-the-art equipment and professional training environments",
      color: "#22c55e"
    },
    {
      icon: "👨‍🏫",
      title: "Expert Coaches",
      desc: "Certified professionals with years of experience",
      color: "#3b82f6"
    },
    {
      icon: "🕐",
      title: "Flexible Schedule",
      desc: "Morning, evening, and weekend sessions available",
      color: "#f97316"
    },
    {
      icon: "💰",
      title: "Best Prices",
      desc: "Affordable memberships with great value",
      color: "#eab308"
    },
    {
      icon: "👥",
      title: "Community",
      desc: "Join a supportive community of fitness enthusiasts",
      color: "#ec4899"
    },
    {
      icon: "🏅",
      title: "Achievements",
      desc: "Track your progress and earn badges",
      color: "#a855f7"
    }
  ];

  const stats = [
    { value: "5000+", label: "Happy Members", icon: "😊" },
    { value: "50+", label: "Expert Coaches", icon: "👨‍🏫" },
    { value: "20+", label: "Sport Activities", icon: "⚽" },
    { value: "10+", label: "Years of Excellence", icon: "🏆" }
  ];

  const sports = [
    { name: "Football", icon: "⚽", color: "#22c55e" },
    { name: "Basketball", icon: "🏀", color: "#f97316" },
    { name: "Swimming", icon: "🏊", color: "#0ea5e9" },
    { name: "Tennis", icon: "🎾", color: "#facc15" },
    { name: "Gym", icon: "💪", color: "#ef4444" },
    { name: "Yoga", icon: "🧘", color: "#8b5cf6" }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Ahmed Mohamed",
      role: "Member since 2022",
      text: "Pegasus Club transformed my fitness journey! The coaches are amazing and facilities are top-notch.",
      rating: 5,
      avatar: "👨"
    },
    {
      name: "Sara Ibrahim",
      role: "Member since 2021",
      text: "Best sports club in town! Great community and excellent programs for all ages.",
      rating: 5,
      avatar: "👩"
    },
    {
      name: "Omar Khaled",
      role: "Member since 2023",
      text: "State-of-the-art equipment and professional trainers. Highly recommended!",
      rating: 5,
      avatar: "🧔"
    }
  ];

  // Membership Plans
  const membershipPlans = [
    { name: "Basic", price: "1500", duration: "Month", features: ["Gym Access", "Basic Classes", "Locker Room"], popular: false },
    { name: "Pro", price: "2500", duration: "Month", features: ["Gym Access", "All Classes", "Pool Access", "Personal Trainer (1 session)"], popular: true },
    { name: "Premium", price: "5000", duration: "Month", features: ["Gym Access", "All Classes", "Pool Access", "Unlimited PT", "Spa Access", "Guest Pass"], popular: false }
  ];

  // Working Hours
  const workingHours = [
    { day: "Monday - Friday", hours: "6:00 AM - 11:00 PM" },
    { day: "Saturday", hours: "8:00 AM - 10:00 PM" },
    { day: "Sunday", hours: "8:00 AM - 9:00 PM" }
  ];

  // Upcoming Events
  const upcomingEvents = [
    { name: "Summer Championship", date: "June 20, 2025", time: "9:00 AM", location: "Main Stadium" },
    { name: "Fitness Workshop", date: "June 25, 2025", time: "5:00 PM", location: "Gym Hall" },
    { name: "Swimming Gala", date: "June 28, 2025", time: "10:00 AM", location: "Olympic Pool" }
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <div style={{
        position: "relative",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "60px 20px",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(168,85,247,0.15), transparent 50%)",
          pointerEvents: "none"
        }} />
        
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            marginBottom: "30px",
            animation: "bounce 2s ease-in-out infinite"
          }}>
            <span style={{
              fontSize: "90px",
              display: "inline-block",
              filter: "drop-shadow(0 0 25px rgba(168,85,247,0.5))"
            }}>
              🐴
            </span>
          </div>
          
          <h1 style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: "800",
            marginBottom: "20px",
            background: "linear-gradient(135deg, #c084fc, #60a5fa, #a855f7)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.02em",
            textShadow: "0 0 30px rgba(168,85,247,0.3)"
          }}>
            Welcome to Pegasus Club
          </h1>
          
          <p style={{
            fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
            color: "#cbd5e1",
            maxWidth: "700px",
            margin: "0 auto 35px",
            lineHeight: "1.6"
          }}>
            Where fitness meets excellence. Join the most prestigious sports club 
            and transform your life with our world-class facilities and expert coaches.
          </p>
          
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
              style={{
                background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                color: "white",
                border: "none",
                padding: "14px 45px",
                fontSize: "1rem",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s",
                boxShadow: "0 10px 25px -5px rgba(168,85,247,0.4)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 15px 35px -5px rgba(168,85,247,0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 25px -5px rgba(168,85,247,0.4)";
              }}
            >
              {isLoggedIn ? "✨ Go to Dashboard" : "🚀 Get Started"}
            </button>
            
            <button
              onClick={() => navigate("/sports")}
              style={{
                background: "transparent",
                color: "#c084fc",
                border: "2px solid #c084fc",
                padding: "12px 42px",
                fontSize: "1rem",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s",
                backdropFilter: "blur(10px)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(168,85,247,0.1)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ⚡ Explore Sports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        maxWidth: "1100px",
        margin: "20px auto 60px",
        padding: "0 20px"
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card"
            style={{
              textAlign: "center",
              padding: "30px 20px",
              background: "rgba(30,41,59,0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              border: "1px solid rgba(168,85,247,0.2)",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.borderColor = "#a855f7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.2)";
            }}
          >
            <div style={{ fontSize: "45px", marginBottom: "10px" }}>{stat.icon}</div>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#c084fc" }}>{stat.value}</div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "5px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sports Section */}
      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "50px",
          background: "linear-gradient(135deg, #c084fc, #60a5fa)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          Our Sports
        </h2>
        
        <div className="grid-3">
          {sports.map((sport, index) => (
            <div
              key={index}
              className="card"
              style={{
                textAlign: "center",
                padding: "30px 20px",
                background: "rgba(30,41,59,0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                border: `1px solid ${sport.color}30`,
                transition: "all 0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = sport.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = `${sport.color}30`;
              }}
              onClick={() => navigate("/sports")}
            >
              <div style={{
                fontSize: "55px",
                marginBottom: "15px",
                display: "inline-block"
              }}>
                {sport.icon}
              </div>
              <h3 style={{ color: sport.color, marginBottom: "10px", fontSize: "1.3rem" }}>
                {sport.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section - Why Choose Us */}
      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "50px",
          background: "linear-gradient(135deg, #c084fc, #60a5fa)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          Why Choose Pegasus Club?
        </h2>
        
        <div className="grid-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card"
              style={{
                textAlign: "center",
                padding: "30px 20px",
                background: "rgba(30,41,59,0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                border: `1px solid ${feature.color}30`,
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = `${feature.color}30`;
              }}
            >
              <div style={{
                fontSize: "55px",
                marginBottom: "15px",
                display: "inline-block",
                animation: "float 3s ease-in-out infinite",
                animationDelay: `${index * 0.15}s`
              }}>
                {feature.icon}
              </div>
              <h3 style={{ color: feature.color, marginBottom: "10px", fontSize: "1.3rem" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.5" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== NEW SECTIONS ========== */}

      {/* 📍 Location & Working Hours Section */}
      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px"
        }}>
          {/* Location Card */}
          <div className="card" style={{ padding: "30px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "50px" }}>📍</span>
              <h2 style={{ color: "#c084fc", marginTop: "10px" }}>Our Location</h2>
            </div>
            <div style={{ textAlign: "center" }}>
              <p>📍 New Cairo, Egypt</p>
              <p>🏢 Fifth Settlement, near AUC</p>
              <p>📞 +20 123 456 789</p>
              <p>📧 info@pegasusclub.com</p>
            </div>
            {/* Simple Map Embed */}
            <div style={{
              marginTop: "20px",
              height: "200px",
              background: "rgba(168,85,247,0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(168,85,247,0.3)",
              overflow: "hidden"
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1x3452.5!2d31.5!3d30.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583d3d4e5d5d5d%3A0x5d5d5d5d5d5d5d5d!2z2YXZg9mK2YUg2KfZhNiq2YbYqQ!5e0!3m2!1sar!2seg!4v1700000000000!5m2!1sar!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Pegasus Club Location"
              ></iframe>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="card" style={{ padding: "30px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "50px" }}>⏰</span>
              <h2 style={{ color: "#c084fc", marginTop: "10px" }}>Working Hours</h2>
            </div>
            {workingHours.map((item, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: idx < workingHours.length - 1 ? "1px solid rgba(168,85,247,0.2)" : "none"
              }}>
                <span style={{ fontWeight: "bold", color: "#c084fc" }}>{item.day}</span>
                <span>{item.hours}</span>
              </div>
            ))}
            <div style={{ marginTop: "20px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
              24/7 Access for Premium Members
            </div>
          </div>
        </div>
      </div>

      {/* 📅 Upcoming Events Section */}
      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "40px",
          background: "linear-gradient(135deg, #c084fc, #60a5fa)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          📅 Upcoming Events
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px"
        }}>
          {upcomingEvents.map((event, idx) => (
            <div key={idx} className="card" style={{ textAlign: "center", padding: "25px" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
              <h3 style={{ color: "#c084fc" }}>{event.name}</h3>
              <p>📅 {event.date}</p>
              <p>⏰ {event.time}</p>
              <p>📍 {event.location}</p>
              <button 
                onClick={() => navigate("/events")}
                style={{ marginTop: "15px", padding: "8px 20px", fontSize: "0.9rem" }}
              >
                Join Event
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 💪 Membership Plans Section */}
      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "40px",
          background: "linear-gradient(135deg, #c084fc, #60a5fa)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          💪 Membership Plans
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px"
        }}>
          {membershipPlans.map((plan, idx) => (
            <div key={idx} className="card" style={{ 
              textAlign: "center", 
              padding: "30px",
              position: "relative",
              border: plan.popular ? "2px solid #c084fc" : "1px solid rgba(168,85,247,0.3)"
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#c084fc",
                  color: "#fff",
                  padding: "4px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: "1.8rem", color: "#c084fc" }}>{plan.name}</h3>
              <div style={{ margin: "20px 0" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#c084fc" }}>${plan.price}</span>
                <span style={{ color: "#94a3b8" }}> / {plan.duration}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} style={{ padding: "8px 0", borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate(isLoggedIn ? "/payment" : "/signup")}
                style={{ marginTop: "25px", width: "100%" }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ Testimonials Section */}
      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "40px",
          background: "linear-gradient(135deg, #c084fc, #60a5fa)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          ⭐ What Our Members Say
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px"
        }}>
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="card" style={{ padding: "25px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, #a855f7, #3b82f6)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px"
                }}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 style={{ color: "#c084fc", margin: 0 }}>{testimonial.name}</h3>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{testimonial.role}</p>
                </div>
              </div>
              <p style={{ fontStyle: "italic", color: "#cbd5e1" }}>"{testimonial.text}"</p>
              <div style={{ marginTop: "10px", color: "#fbbf24" }}>
                {"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📱 Social Media Section */}
      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px" }}>
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <h2 style={{ color: "#c084fc", marginBottom: "20px" }}>Follow Us</h2>
          <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Stay connected with us on social media</p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" style={{ 
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              textDecoration: "none",
              transition: "transform 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              📘
            </a>
            <a href="#" style={{ 
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              textDecoration: "none",
              transition: "transform 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              📸
            </a>
            <a href="#" style={{ 
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              textDecoration: "none",
              transition: "transform 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              🐦
            </a>
            <a href="#" style={{ 
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              textDecoration: "none",
              transition: "transform 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              💼
            </a>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div style={{ maxWidth: "1200px", margin: "60px auto", padding: "0 20px" }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          marginBottom: "40px",
          background: "linear-gradient(135deg, #c084fc, #60a5fa)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          All in Pegasus Club
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px"
        }}>
          <div style={{
            background: "url('https://www.pegasusclub.com.eg/wp-content/uploads/2015/03/pool-2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "260px",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              padding: "20px",
              textAlign: "center"
            }}>
              <p style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>🏊‍♂️ Swimming Pool</p>
            </div>
          </div>

          <div style={{
            background: "url('https://www.pegasusclub.com.eg/wp-content/uploads/2015/03/115.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "260px",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              padding: "20px",
              textAlign: "center"
            }}>
              <p style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>🏛️ Admission Building</p>
            </div>
          </div>

          <div style={{
            background: "url('https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "260px",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              padding: "20px",
              textAlign: "center"
            }}>
              <p style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>🌲 Pegasus Garden Walk</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        margin: "60px auto",
        maxWidth: "900px",
        padding: "0 20px"
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.15))",
          borderRadius: "30px",
          padding: "50px 30px",
          textAlign: "center",
          border: "1px solid rgba(168,85,247,0.3)",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            marginBottom: "15px",
            color: "#c084fc"
          }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{
            color: "#94a3b8",
            marginBottom: "30px",
            fontSize: "1rem",
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Join Pegasus Club today and become part of an extraordinary fitness community
          </p>
          <button
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              color: "white",
              border: "none",
              padding: "14px 48px",
              fontSize: "1rem",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s",
              boxShadow: "0 10px 25px -5px rgba(168,85,247,0.4)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.02)";
              e.target.style.boxShadow = "0 15px 35px -5px rgba(168,85,247,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 10px 25px -5px rgba(168,85,247,0.4)";
            }}
          >
            {isLoggedIn ? "🌟 Go to Dashboard" : "🐴 Join Now"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}