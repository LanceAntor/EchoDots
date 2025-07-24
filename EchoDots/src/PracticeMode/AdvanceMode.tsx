
import React, { useState } from "react";

// Morse code map for A-Z and 0-9

const morseMap: Record<string, string> = {
    
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----."
};

function textToMorse(text: string) {
  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      if (char === " ") return "/";
      return morseMap[char] || "";
    })
    .join(" ");
}

// Morse code sound player
let audioCtx: AudioContext | null = null;
let currentOscs: OscillatorNode[] = [];
function playMorse(morse: string) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext)();
  }
  if (!audioCtx) return;
  // Stop any currently playing sound
  if (currentOscs.length > 0) {
    currentOscs.forEach((osc) => { try { osc.stop(); } catch { /* empty */ } });
  }
  currentOscs = [];
  let time = audioCtx.currentTime;
  morse.split('').forEach((char) => {
    let osc: OscillatorNode | null = null;
    if (audioCtx) {
      if (char === '.') {
        osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 700;
        osc.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.15);
        time += 0.2;
      } else if (char === '-') {
        osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 700;
        osc.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.45);
        time += 0.5;
      }
      if (osc) currentOscs.push(osc);
    }
    time += 0.05;
  });
}

const AdvanceMode: React.FC = () => {
  const [input, setInput] = useState("");
const [basicHovered, setBasicHovered] = useState(false);
  return (
    <div style={{ width: "100%", height: "100vh", background: "#5d8662", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>
      <h1 style={{ color: "#d9d9d9", fontSize: "3rem", fontWeight: "bold", marginTop: "1.5rem", marginBottom: "1.5rem", textAlign: "center", letterSpacing: "0.08em", textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)" }}>Advanced Mode</h1>
      <div style={{ width: "90%", maxWidth: 1200 }}>
        <div style={{ marginBottom: "1.2rem" }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Input Text"
            style={{
              width: "100%",
              fontSize: "2rem",
              fontWeight: 700,
              padding: "0.6em 1em",
              borderRadius: "1em",
              border: "2px solid #d9d9b0",
              background: "transparent",
              color: "#fff",
              outline: "none",
              marginBottom: 0,
              fontFamily: "Lexend, sans-serif"
            }}
            maxLength={50}
          />
        </div>
        <div style={{
          minHeight: 320,
          width: "100%",
          background: "transparent",
          border: "2px solid #d9d9b0",
          borderRadius: "1em",
          color: "#fff",
          fontSize: "2rem",
          fontWeight: 500,
          padding: "1.2em 1.2em",
          fontFamily: "Lexend, sans-serif",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          marginBottom: "1rem",
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: '100%', textAlign: 'left', minHeight: '2em' }}>
            {input ? textToMorse(input) : ""}
          </div>
          <button
            style={{
              marginTop: '6.5rem',
              padding: '0.6em 2.2em',
              borderRadius: '1em',
              border: '2px solid #d9d9b0',
              background: 'transparent',
              color: '#222',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'Lexend, sans-serif',
              cursor: input ? 'pointer' : 'not-allowed',
              opacity: input ? 1 : 0.5,
              transition: 'all 0.18s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em',
            }}
            disabled={!input}
            onClick={() => input && playMorse(textToMorse(input))}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="11" fill="#222"/>
              <polygon points="9,7 16,11 9,15" fill="#fff"/>
            </svg>
            Play
          </button>
        </div>
      </div>
       <span
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: basicHovered ? "#222" : "#fff",
          fontSize: "1.2rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "Lexend, sans-serif",
          borderRadius: "8px",
          padding: "0.4em 1.2em",
          transition: "all 0.18s"
        }}
        onClick={() => window.location.href = "/PracticeMode"}
        onMouseEnter={() => setBasicHovered(true)}
        onMouseLeave={() => setBasicHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = "/PracticeMode"; }}
      >
        {"< Basic Mode"}
      </span>
    </div>
  );
};

export default AdvanceMode;
