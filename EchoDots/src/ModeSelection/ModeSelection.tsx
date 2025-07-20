import React from "react";

const ModeSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#5d8662] flex flex-col items-center justify-center font-['Lexend']">
      <h1
        className="text-[#d9d9d9] text-8xl font-bold mb-12 text-center tracking-wider"
        style={{
          marginTop: "-80px",
          textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        Select Mode
      </h1>
      <div className="flex gap-12">
        <button
          className="bg-[#7fa77c] text-white text-5xl font-bold border-2 border-[#222] rounded-3xl cursor-pointer text-left leading-tight flex items-center justify-center mode-btn"
          style={{
            boxShadow: "0 12px 18px rgba(0,0,0,0.28)",
            textShadow: "0 2px 8px rgba(0,0,0,0.18)",
            width: "350px",
            height: "280px",
            padding: 0,
            transition: "all 0.18s cubic-bezier(.4,2,.3,1)",
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "#8bb88a";
            e.currentTarget.style.transform = "translateY(-8px) scale(1.04)";
            e.currentTarget.style.boxShadow = "0 18px 32px rgba(0,0,0,0.32)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "#7fa77c";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 12px 18px rgba(0,0,0,0.28)";
          }}
          onClick={() => window.location.href = "/PracticeMode"}
        >
          Learn Morse<br />Code
        </button>
        <button
          className="bg-[#7fa77c] text-white text-5xl font-bold border-2 border-[#222] rounded-3xl cursor-pointer text-left leading-tight flex items-center justify-center mode-btn"
          style={{
            boxShadow: "0 12px 18px rgba(0,0,0,0.28)",
            textShadow: "0 2px 8px rgba(0,0,0,0.18)",
            width: "350px",
            height: "280px",
            padding: 0,
            transition: "all 0.18s cubic-bezier(.4,2,.3,1)",
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "#8bb88a";
            e.currentTarget.style.transform = "translateY(-8px) scale(1.04)";
            e.currentTarget.style.boxShadow = "0 18px 32px rgba(0,0,0,0.32)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "#7fa77c";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 12px 18px rgba(0,0,0,0.28)";
          }}
        >
          Test Your<br />Skils
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;