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
function playMorse(morse: string) {
  const win = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  const ctx = new (win.AudioContext || win.webkitAudioContext!)();
  let time = ctx.currentTime;
  morse.split("").forEach((char) => {
    if (char === ".") {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 700;
      osc.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.15);
      time += 0.2;
    } else if (char === "-") {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 700;
      osc.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.45);
      time += 0.5;
    }
    time += 0.05;
  });
}

const PracticeMode: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (letter: string) => {
    setSelected(letter);
    playMorse(morseMap[letter]);
  };

  return (
    <div className="min-h-screen bg-[#5d8662] flex flex-col items-center px-4 py-8 font-['Lexend']">
      <button
        className="absolute top-8 left-8 text-4xl text-[#d9d9d9] font-bold"
        onClick={() => window.history.back()}
        aria-label="Back"
      >
        ←
      </button>
      <h1
        className="text-[#d9d9d9] text-5xl font-bold mb-8 text-center tracking-wider"
        style={{
          textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        Practice Mode
      </h1>
      <div className="flex flex-col gap-2 justify-center items-center mb-4">
        <div className="flex gap-4">
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
              >
                {letter}
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 mt-2">
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
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
      <button
        className="text-2xl font-bold text-[#fff] border-2 border-[#d9d9b0] rounded-xl px-6 py-2 bg-transparent mb-6"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
      >
        Summary
      </button>
      <div
        className="w-full max-w-3xl border-4 border-[#d9d9b0] rounded-xl flex flex-col items-center justify-center mx-auto py-12 mb-4"
        style={{ background: "rgba(0,0,0,0.03)" }}
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
          className="mt-8 px-6 py-2 rounded-xl bg-[#eaeaea] text-[#222] text-xl font-bold flex items-center gap-2"
          onClick={() => selected && playMorse(morseMap[selected])}
          disabled={!selected}
        >
          <span style={{ fontSize: "1.5em" }}>▶</span> Play
        </button>
      </div>
    </div>
  );
};

export default PracticeMode;
