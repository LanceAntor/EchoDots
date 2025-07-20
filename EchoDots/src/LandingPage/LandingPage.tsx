import React from "react";
import brainHeadset from "../assets/brain_headset.png";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full font-">
      <div className="absolute inset-0 bg-[#5d8662] w-full h-full -z-10" />
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">EchoDots</h1>
          <h2 className="landing-subtitle">Where every dots is a message</h2>
          <p className="landing-desc">
            Learn the rhythm of dots and dashes through fun lessons, real-time practice, and addictive mini-games. Whether you're just starting out or brushing up your skills, EchoDots makes decoding simple, smart, and engaging. Start your journey today and let your messages be heard in a whole new way.
          </p>
          <button className="landing-btn" onClick={() => navigate("/ModeSelection")}>Learn Now</button>
        </div>
        <div className="landing-image">
          <img
            src={brainHeadset}
            alt="EchoDots Mascot"
            className="mascot-img"
          />
        </div>
      </div>
      <footer className="landing-footer">
        Developed by Lance Antor<br />
        © 2025 EchoDots. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
