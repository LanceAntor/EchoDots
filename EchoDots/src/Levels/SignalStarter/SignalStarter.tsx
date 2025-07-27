import React, { useState } from "react";

const morseMap: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--.."
};

const letters = Object.keys(morseMap);

function getRandomLetter() {
  return letters[Math.floor(Math.random() * letters.length)];
}

const SignalStarter: React.FC = () => {
  const [currentLetter, setCurrentLetter] = useState(getRandomLetter());
  const [input, setInput] = useState<string>("");
  const [modal, setModal] = useState<null | { correct: boolean; correctAnswer: string }>(null);
  // For auto-close timeout
  const modalTimeoutRef = React.useRef<number | null>(null);

  // Morse sound effect (reuse AudioContext for instant sound)
  let audioCtxRef: AudioContext | undefined;
  const win = window as unknown as { _signalStarterAudioCtx?: AudioContext };
  audioCtxRef = win._signalStarterAudioCtx;
  if (!audioCtxRef) {
    audioCtxRef = new (window.AudioContext)();
    win._signalStarterAudioCtx = audioCtxRef;
  }
  function playBeep(type: '.' | '-') {
    const ctx = audioCtxRef!;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 700;
    osc.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === '.') {
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      osc.start(now);
      osc.stop(now + 0.45);
    }
    osc.onended = () => { osc.disconnect(); };
  }

  const handleDot = () => {
    setInput((prev) => prev + ".");
    playBeep('.')
  };
  const handleDash = () => {
    setInput((prev) => prev + "-");
    playBeep('-')
  };
  const handleSubmit = () => {
    const correctAnswer = morseMap[currentLetter];
    const isCorrect = input === correctAnswer;
    setModal({ correct: isCorrect, correctAnswer });
    // Auto-close modal after 1.2s if correct, 2s if incorrect
    if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    modalTimeoutRef.current = setTimeout(() => {
      setModal(null);
      setInput("");
      setCurrentLetter(getRandomLetter());
    }, isCorrect ? 1200 : 2000);
  };

  // Allow click to close modal early
  const handleCloseModal = () => {
    if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    setModal(null);
    setInput("");
    setCurrentLetter(getRandomLetter());
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#56725d", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "Lexend, sans-serif", position: 'relative' }}>
      {/* Modal for answer verification */}
      {modal && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.32)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              minWidth: 320,
              minHeight: 180,
              background: '#7b9b74',
              borderRadius: 18,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 32px 32px 32px',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 38, fontWeight: 700, color: '#222', fontFamily: 'Lexend, serif', marginBottom: 12 }}>
              {modal.correct ? 'Correct' : 'Incorrect'}
            </span>
            {!modal.correct && (
              <>
                <span style={{ fontSize: 20, color: '#222', fontFamily: 'Lexend, serif', marginBottom: 10, display: 'block' }}>Correct answer</span>
                <span style={{ fontSize: '2.5rem', color: '#fff', letterSpacing: 8, fontFamily: 'Kumar One, serif', display: 'inline-block', marginTop: 4 }}>
                  {modal.correctAnswer.split("").map((c, i) =>
                    c === "."
                      ? <span key={i} style={{ margin: "0 0.2em", display: 'inline-block', verticalAlign: 'middle' }}>●</span>
                      : <span key={i} style={{ margin: "0 0.2em", display: 'inline-block', verticalAlign: 'middle' }}>—</span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      )}
      <button
        style={{ position: "absolute", left: 32, top: 32, background: "none", border: "none", fontSize: 36, color: "#fff", cursor: "pointer" }}
        onClick={() => window.history.back()}
        aria-label="Back"
      >
        ←
      </button>
      <h1 style={{ color: "#d9d9d9", fontSize: "3rem", fontWeight: 700, marginTop: 26, textAlign: "center", letterSpacing: "0.08em", textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)" }}>Signal Starter</h1>
      <h1 style={{ color: "#d9d9d9", fontSize: "1rem", fontWeight: 500, marginTop: 5, marginBottom: 24, textAlign: "center", letterSpacing: "0.08em", textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)" }}>Type the correct morse code base on the given letter.</h1>
      <div style={{
        width: 900, maxWidth: "95vw", height: 350, background: "transparent", border: "5px solid #e6e9c2", borderRadius: 18, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative"
      }}>
        
        <div style={{ width: "100%", height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
            
          <span style={{ color: "#fff", fontSize: "7rem", fontWeight: 600, fontFamily: "Lexend, serif" }}>{currentLetter}</span>
        </div>
        <div style={{ width: "100%", height: 120, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "4px solid #e6e9c2", position: "relative" }}>
          <div
            style={{
              width: "90%",
              height: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              borderRadius: 12,
              padding: "0 12px",
              boxSizing: "border-box",
              scrollbarWidth: "thin",
              msOverflowStyle: "auto",
              justifyContent: input.length === 0 || input.length * 60 < 0.85 * 900 ? "center" : "flex-start"
            }}
            id="morse-scroll-container"
          >
            <span style={{ fontSize: "3.5rem", color: "#fff", letterSpacing: 8, fontFamily: "Kumar One, serif", display: "inline-block" }}>
              {input.split("").map((c, i) => c === "." ? <span key={i} style={{ margin: "0 0.2em" }}>●</span> : <span key={i} style={{ margin: "0 0.2em" }}>—</span>)}
            </span>
          </div>
          {/* Clear button - always visible, never covered by input */}
          <button
            style={{
              position: 'absolute',
              top: 18,
              right: 24,
              zIndex: 2,
              background: 'transparent',
              border: '3px solid #e6e9c2',
              borderRadius: 16,
              color: '#fff',
              fontSize: 22,
              fontFamily: 'Kumar One, serif',
              padding: '10px 30px',
              cursor: 'pointer',
              transition: 'background 0.15s',
              backgroundColor: 'rgba(86,114,93,0.92)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
            onClick={() => setInput("")}
          >
            Clear
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 32, marginTop: 48, marginBottom: 0 }}>
        <button
          style={{ width: 130, height: 80, borderRadius: 16, border: "3px solid #e6e9c2", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, color: "#fff", marginRight: 8, cursor: "pointer" }}
          onClick={handleDot}
        >
          <span style={{ width: 38, height: 38, background: "#fff", borderRadius: "50%", display: "inline-block" }}></span>
        </button>
        <button
          style={{ width: 130, height: 80, borderRadius: 16, border: "3px solid #e6e9c2", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, color: "#fff", marginRight: 8, cursor: "pointer" }}
          onClick={handleDash}
        >
          <span style={{ width: 70, height: 16, background: "#fff", borderRadius: 8, display: "inline-block" }}></span>
        </button>
        <button
          style={{ width: 130, height: 80, borderRadius: 16, border: "3px solid #e6e9c2", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff", fontFamily: "Kumar One, serif", cursor: "pointer" }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SignalStarter;
