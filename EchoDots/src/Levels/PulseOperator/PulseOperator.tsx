import React, { useState } from "react";

const morseMap: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--.."
};

const words = [
  "ECHO", "CODE", "DOT", "PULSE", "SIGNAL", "START", "OPERATOR", "SPROUT", "COMMANDER", "DECODER"
];

function textToMorse(text: string) {
  return text
    .toUpperCase()
    .split("")
    .map((char) => morseMap[char] || "")
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

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

const PulseOperator: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [playHovered, setPlayHovered] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);

  const handlePlay = () => {
    playMorse(textToMorse(currentWord));
  };

  const handleSubmit = () => {
    if (input.trim().toUpperCase() === currentWord) {
      setResult(true);
      setTimeout(() => {
        setResult(null);
        setInput("");
        setCurrentWord(getRandomWord());
      }, 1200);
    } else {
      setResult(false);
      setTimeout(() => {
        setResult(null);
        setInput("");
      }, 2000);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#56725d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Lexend, sans-serif",
        position: "relative",
      }}
    >
      {/* Back Arrow */}
      <button
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          background: "none",
          border: "none",
          fontSize: "2.5rem",
          color: "#d9d9d9",
          cursor: "pointer",
        }}
        onClick={() => window.history.back()}
        aria-label="Back"
      >
        ←
      </button>
      {/* Title */}
      <h1
        style={{
          color: "#d9d9d9",
          fontSize: "4rem",
          fontWeight: "bold",
          marginTop: "1.7rem",
          marginBottom: "1rem",
          textAlign: "center",
          letterSpacing: "0.08em",
          textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        Pulse Operator
      </h1>
      <h1
        style={{
          color: "#d9d9d9",
          fontSize: "1rem",
          fontWeight: "bold",
          marginBottom: "4.5rem",
          textAlign: "center",
          letterSpacing: "0.08em",
          textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)",
        }}
      >
        Listen closely to the Morse signal sequence.
      </h1>
      {/* Play Button */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <button
          style={{
            padding: "0.4em 1.5em",
            borderRadius: "1em",
            border: "none",
            background: playHovered ? "#e6e6b0" : "#fff",
            color: playHovered ? "#222" : "#222",
            fontSize: "1.3rem",
            fontWeight: 700,
            fontFamily: "Lexend, sans-serif",
            cursor: "pointer",
            boxShadow: playHovered ? "0 4px 16px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.10)",
            display: "flex",
            alignItems: "center",
            gap: "0.5em",
            transition: "all 0.18s"
          }}
          onClick={handlePlay}
          onMouseEnter={() => setPlayHovered(true)}
          onMouseLeave={() => setPlayHovered(false)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#222" />
            <polygon points="9,7 16,11 9,15" fill="#fff" />
          </svg>
          Play
        </button>
      </div>
      {/* Input Box */}
      <div
        style={{
          width: "90%",
          maxWidth: 900,
          display: "flex",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            border: "5px solid #e6e6b0",
            borderRadius: "1em",
            background: "transparent",
            padding: "0.5em 1.2em",
            fontSize: "2rem",
            fontWeight: 700,
            color: "#fff",
            fontFamily: "Lexend, sans-serif",
            position: "relative",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Input Text"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: 700,
              fontFamily: "Lexend, sans-serif",
              width: "100%",
              paddingLeft: "0.2em",
            }}
            autoFocus
          />
        </div>
        <button
          style={{
            marginLeft: "-4px",
            padding: "0.5em 1.4em",
            borderRadius: "1em",
            border: "5px solid #e6e6b0",
            background: submitHovered ? "#e6e6b0" : "transparent",
            color: "#222",
            fontSize: "2rem",
            fontWeight: 700,
            fontFamily: "Lexend, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            transition: "all 0.18s"
          }}
          onClick={handleSubmit}
          onMouseEnter={() => setSubmitHovered(true)}
          onMouseLeave={() => setSubmitHovered(false)}
        >
          <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
            <path d="M6 18L30 6L24 30L18 24L6 18Z" stroke="#222" strokeWidth="3" fill="none" />
          </svg>
        </button>
      </div>
      {/* Result Modal */}
      {result !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.32)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setResult(null)}
        >
          <div
            style={{
              minWidth: 320,
              minHeight: 180,
              background: "#8aa784",
              borderRadius: 18,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "36px 32px 32px 32px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#222",
                marginBottom: "1.2rem",
              }}
            >
              {result ? "Correct" : "Incorrect"}
            </div>
            {!result && (
              <>
                <div
                  style={{
                    fontSize: "1.4rem",
                    color: "#222",
                    marginBottom: "1.2rem",
                  }}
                >
                  Correct answer
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  {currentWord}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PulseOperator;