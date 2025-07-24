import React, { useState } from "react";

// Morse code map
const morseMap: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--.."
};

// Simple beep sound generator for Morse code
interface PlayMorseFn {
  (morse: string): void;
  ctx?: AudioContext;
  currentOscs?: OscillatorNode[];
}
const playMorse: PlayMorseFn = function(morse: string) {
  const win = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  // Use a persistent context so only one sound plays at a time
  if (!playMorse.ctx) {
    playMorse.ctx = new (win.AudioContext || win.webkitAudioContext!)();
  }
  const ctx = playMorse.ctx!;
  // Stop any currently playing sound
  if (playMorse.currentOscs && playMorse.currentOscs.length > 0) {
    playMorse.currentOscs.forEach((osc) => {
      try { osc.stop(); } catch { /* ignore */ }
    });
  }
  playMorse.currentOscs = [];
  let time = ctx.currentTime;
  morse.split("").forEach((char) => {
    let osc: OscillatorNode | null = null;
    if (char === ".") {
      osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 700;
      osc.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.15);
      time += 0.2;
    } else if (char === "-") {
      osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 700;
      osc.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.45);
      time += 0.5;
    }
    if (osc) playMorse.currentOscs!.push(osc);
    time += 0.05;
  });
}
playMorse.ctx = undefined;
playMorse.currentOscs = [];

const PracticeMode: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBtnHovered, setPlayBtnHovered] = useState(false);
  const [advanceBtnHovered, setAdvanceBtnHovered] = useState(false);

  // Helper to calculate total duration of morse code
  function getMorseDuration(morse: string) {
    let duration = 0;
    morse.split("").forEach((char) => {
      if (char === ".") duration += 0.2;
      else if (char === "-") duration += 0.5;
      duration += 0.05;
    });
    return duration;
  }

  const handleSelect = (letter: string) => {
    if (isPlaying) return;
    setSelected(letter);
    setIsPlaying(true);
    playMorse(morseMap[letter]);
    const duration = getMorseDuration(morseMap[letter]);
    setTimeout(() => setIsPlaying(false), duration * 1000);
  };

  return (
    <div
      className="min-h-screen bg-[#5d8662] flex flex-col items-center px-4 py-8 font-['Lexend']"
      style={{
        height: '100vh',
        overflow: 'hidden',
        ...(
          // preserve any other inline styles if present
          typeof window !== 'undefined' && window.innerWidth < 640
            ? { paddingLeft: 0, paddingRight: 0 }
            : {}
        )
      }}
    >
      <button
        className={`absolute top-8 left-15 text-6xl font-bold transition-all duration-150 text-[#d9d9d9] px-4 py-2`}
        onClick={() => window.location.href = "/ModeSelection"}
        aria-label="Back"
        style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
        onMouseEnter={e => { e.currentTarget.querySelector('span')!.style.color = '#000000ff'; }}
        onMouseLeave={e => { e.currentTarget.querySelector('span')!.style.color = '#d9d9d9'; }}
      >
        <span style={{ color: '#d9d9d9', transition: 'color 0.2s' }}>←</span>
      </button>
      <h1
        className="text-[#d9d9d9] text-5xl font-bold mt-7 mb-8 text-center tracking-wider"
        style={{
          textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        Practice Mode
      </h1>
      <div className="flex flex-col gap-1 justify-center items-center mb-4">
        <div className="flex gap-4 justify-center w-full">
          {Object.keys(morseMap).slice(0, 13).map((letter) => {
            const isSelected = selected === letter;
            const isHovered = hovered === letter;
            return (
              <button
                key={letter}
                className={`morse-btn text-2xl font-bold border-2 rounded-xl px-6 py-2  transition-all duration-150
                  ${isSelected ? 'bg-[#d9d9b0] text-[#black] border-[transparent] shadow-lg' :
                    isHovered ? 'bg-[#8bb88a] text-[#fff] border-[#d9d9b0] shadow-lg' :
                    'text-[#fff] border-[#d9d9b0]'}
                `}
                style={{
                  boxShadow: isSelected ? "0 6px 16px rgba(0,0,0,0.18)" :
                    isHovered ? "0 8px 16px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.10)",
                  transform: isHovered ? 'translateY(-4px) scale(1.04)' : 'none',
                }}
                onClick={() => handleSelect(letter)}
                onMouseEnter={() => setHovered(letter)}
                onMouseLeave={() => setHovered(null)}
                disabled={isPlaying}
              >
                {letter}
              </button>
            );
          })}
        </div>
        <div className="flex justify-center w-full mt-2 " style={{
            gap: '15px',
        }}>
          {Object.keys(morseMap).slice(13).map((letter) => {
            const isSelected = selected === letter;
            const isHovered = hovered === letter;
            return (
              <button
                key={letter}
                className={`morse-btn text-2xl font-bold border-2 rounded-xl px-6 py-2  transition-all duration-150
                  ${isSelected ? 'bg-[#d9d9b0] text-[#black] border-[transparent] shadow-lg' :
                    isHovered ? 'bg-[#8bb88a] text-[#fff] border-[#d9d9b0] shadow-lg' :
                    'text-[#fff] border-[#d9d9b0]'}
                `}
                style={{
                  boxShadow: isSelected ? "0 6px 16px rgba(0,0,0,0.18)" :
                    isHovered ? "0 8px 16px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.10)",
                  transform: isHovered ? 'translateY(-4px) scale(1.04)' : 'none',
                }}
                onClick={() => handleSelect(letter)}
                onMouseEnter={() => setHovered(letter)}
                onMouseLeave={() => setHovered(null)}
                disabled={isPlaying}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="border-5 border-[#d9d9b0] rounded-xl flex flex-col items-center justify-center py-12 padding-0 margin-0"
        style={{ 
          background: "rgba(0,0,0,0.03)", 
          maxWidth: "72%",
          width: "100%",
          height: "340px",
        }}
      >
        <div className="flex items-center justify-center w-full">
          <div className="flex-1 text-center text-6xl text-[#fff] font-bold">
            {selected
              ? morseMap[selected].split("").map((c, i) => (
                  <span key={i} style={{ margin: "0 0.2em" }}>
                    {c === "." ? "●" : "—"}
                  </span>
                ))
              : <span className="opacity-40">● —</span>}
          </div>
          <div className="w-1 h-32 bg-[#d9d9b0] mx-8" />
          <div className="flex-1 text-center text-[7rem] text-[#fff] font-bold">
            {selected || <span className="opacity-40">A</span>}
          </div>
        </div>
        <button
          className={`mt-7 px-6 py-2 rounded-xl border-2 border-[#d9d9b0] text-xl font-bold flex items-center gap-2 transition-all duration-150
            ${playBtnHovered ? 'bg-[#d9d9b0] text-[#222] shadow-lg' : 'bg-[transparent] text-[#222]'}
            ${!selected ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={() => {
            if (!selected) return;
            if (!isPlaying) {
              setIsPlaying(true);
              playMorse(morseMap[selected]);
              const duration = getMorseDuration(morseMap[selected]);
              setTimeout(() => setIsPlaying(false), duration * 1000);
            } else {
              // Pause: stop all oscillators
              if (playMorse.currentOscs && playMorse.currentOscs.length > 0) {
                playMorse.currentOscs.forEach((osc) => {
                  try { osc.stop(); } catch { /* ignore */ }
                });
                playMorse.currentOscs = [];
              }
              setIsPlaying(false);
            }
          }}
          onMouseEnter={() => setPlayBtnHovered(true)}
          onMouseLeave={() => setPlayBtnHovered(false)}
          disabled={!selected}
          style={{ minWidth: "140px" }}
        >
          <span style={{ fontSize: "1rem" }}>
            {isPlaying ? '⏸' : '▶'}
          </span>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <span
        style={{
          display: "inline-block",
          marginTop: "15px",
          marginBottom: "1.5rem",
          color: advanceBtnHovered ? "#222" : "#fff",
          fontSize: "1.2rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "Lexend, sans-serif",
          borderRadius: "8px",
          padding: "0.4em 1.2em",
          transition: "all 0.18s"
        }}
        onClick={() => window.location.href = "/AdvanceMode"}
        onMouseEnter={() => setAdvanceBtnHovered(true)}
        onMouseLeave={() => setAdvanceBtnHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = "/AdvanceMode"; }}
      >
        {"Advance Mode >"}
      </span>
    </div>
  );
};

export default PracticeMode;
