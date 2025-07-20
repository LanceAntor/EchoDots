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
          className="bg-[#7fa77c] text-white text-5xl font-bold border-2 border-[#222] rounded-3xl cursor-pointer text-left leading-tight flex items-center justify-center"
          style={{
            boxShadow: "0 12px 18px rgba(0,0,0,0.28)",
            textShadow: "0 2px 8px rgba(0,0,0,0.18)",
            width: "350px",
            height: "280px",
            padding: 0
          }}
        >
          Learn Morse<br />Code
        </button>
        <button
          className="bg-[#7fa77c] text-white text-5xl font-bold border-2 border-[#222] rounded-3xl cursor-pointer text-left leading-tight flex items-center justify-center"
          style={{
            boxShadow: "0 12px 18px rgba(0,0,0,0.28)",
            textShadow: "0 2px 8px rgba(0,0,0,0.18)",
            width: "350px",
            height: "280px",
            padding: 0
          }}
        >
          Test Your<br />Skils
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;