import React, { useState } from "react";

const morseMap: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--.."
};

const letters = Object.keys(morseMap);

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SignalStarter: React.FC = () => {
  // Selection mode and progress
  const [mode, setMode] = useState<null | number>(null);
  const [letterList, setLetterList] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectHovered, setSelectHovered] = useState(false);

  // Game state
  const [input, setInput] = useState<string>("");
  const [modal, setModal] = useState<null | { correct: boolean; correctAnswer: string }>(null);
  const modalTimeoutRef = React.useRef<number | null>(null);

  // For current letter
  const currentLetter = mode !== null && letterList.length > 0 ? letterList[currentIdx] : "";

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

  // Stop all beeps (for modal/finished)
  function stopBeep() {
    if (audioCtxRef && audioCtxRef.state === "running") {
      audioCtxRef.close();
      win._signalStarterAudioCtx = undefined;
    }
  }

  // Selection mode handler
  const handleModeSelect = (count: number) => {
    const shuffled = shuffle(letters).slice(0, count);
    setLetterList(shuffled);
    setCurrentIdx(0);
    setMode(count);
    setInput("");
    setScore(0);
    setFinished(false);
    setModal(null);
  };

  // Handle dot/dash
  const handleDot = () => {
    setInput((prev) => prev + ".");
    playBeep('.');
  };
  const handleDash = () => {
    setInput((prev) => prev + "-");
    playBeep('-');
  };

  // Handle submit
  const handleSubmit = () => {
    stopBeep();
    const correctAnswer = morseMap[currentLetter];
    const isCorrect = input === correctAnswer;
    setModal({ correct: isCorrect, correctAnswer });
    if (isCorrect) setScore((prev) => prev + 1);

    if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    modalTimeoutRef.current = window.setTimeout(() => {
      setModal(null);
      setInput("");
      if (currentIdx + 1 < letterList.length) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setFinished(true);
      }
    }, isCorrect ? 1200 : 2000);
  };

  // Allow click to close modal early
  const handleCloseModal = () => {
    if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    setModal(null);
    setInput("");
    if (currentIdx + 1 < letterList.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
    }
  };

  // Handle restart
  const handleRestart = () => {
    setMode(null);
    setLetterList([]);
    setCurrentIdx(0);
    setInput("");
    setScore(0);
    setFinished(false);
    setModal(null);
  };

  // Stop beep on modal or finished
  React.useEffect(() => {
    if (modal || finished) stopBeep();
  }, [modal, finished]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#56725d", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "Lexend, sans-serif", position: 'relative' }}>
      {/* Selection Mode Modal */}
      {mode === null && (
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
        >
          <div
            style={{
              minWidth: 420,
              minHeight: 320,
              background: "#6d8a6d",
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
                fontSize: "2.2rem",
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "2.2rem",
              }}
            >
              Selection Mode
            </div>
            <div style={{ display: "flex", gap: "2.5rem", marginBottom: "2.5rem" }}>
              <button
                style={{
                  width: 220,
                  height: 120,
                  background: "#7fa37a",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "2rem",
                  borderRadius: "18px",
                  border: "2px solid #222",
                  cursor: "pointer",
                  transition: "background 0.18s, box-shadow 0.18s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
                onClick={() => handleModeSelect(10)}
              >
                10 Letters
              </button>
              <button
                style={{
                  width: 220,
                  height: 120,
                  background: "#7fa37a",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "2rem",
                  borderRadius: "18px",
                  border: "2px solid #222",
                  cursor: "pointer",
                  transition: "background 0.18s, box-shadow 0.18s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
                onClick={() => handleModeSelect(20)}
              >
                20 Letters
              </button>
            </div>
            <button
              style={{
                width: 220,
                height: 120,
                background: "#7fa37a",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "2rem",
                borderRadius: "18px",
                border: "2px solid #222",
                cursor: "pointer",
                transition: "background 0.18s, box-shadow 0.18s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                display: "block",
                margin: "0 auto"
              }}
              onClick={() => handleModeSelect(30)}
            >
              30 Letters
            </button>
          </div>
        </div>
      )}

      {/* Progress Counter */}
      {mode !== null && !finished && (
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 48,
            background: "transparent",
            border: "5px solid #e6e6b0",
            borderRadius: "50%",
            width: 170,
            height: 170,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "3rem",
            color: "#fff",
            zIndex: 10,
          }}
        >
          <div>{currentIdx + 1}</div>
          <div style={{ borderBottom: '2px solid #fff', width: '2em', margin: '0.1em auto 0.1em auto' }}></div>
          <div>{mode}</div>
        </div>
      )}

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

      {/* Finished Modal */}
      {finished && (
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
        >
          <div
            style={{
              minWidth: 420,
              minHeight: 320,
              background: "#6d8a6d",
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
                color: "#fff",
                marginBottom: "2.2rem",
              }}
            >
              Challenge Result
            </div>
            <div style={{
              fontSize: "4rem",
              color: "#fff",
              fontWeight: "bold",
              marginBottom: "2.2rem",
              lineHeight: 1.1,
            }}>
              <span>{score}</span>
              <div style={{
                borderBottom: "4px solid #fff",
                width: "80px",
                margin: "0.2em auto 0.2em auto"
              }} />
              <span>{mode}</span>
            </div>
            <button
              style={{
                marginTop: "1.5rem",
                padding: "0.7em 2.5em",
                borderRadius: "1em",
                border: "2px solid #222",
                background: selectHovered ? "#e6e6b0" : "#7fa37a",
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "Lexend, sans-serif",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                transition: "background 0.18s"
              }}
              onClick={handleRestart}
              onMouseEnter={() => setSelectHovered(true)}
              onMouseLeave={() => setSelectHovered(false)}
            >
              Select Mode
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        style={{ position: "absolute", left: 32, top: 32, background: "none", border: "none", fontSize: 36, color: "#fff", cursor: "pointer" }}
        onClick={() => {
          stopBeep();
          window.history.back();
        }}
        aria-label="Back"
      >
        ←
      </button>
      {/* Title */}
      <h1 style={{ color: "#d9d9d9", fontSize: "3rem", fontWeight: 700, marginTop: 26, textAlign: "center", letterSpacing: "0.08em", textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)" }}>Signal Starter</h1>
      <h1 style={{ color: "#d9d9d9", fontSize: "1rem", fontWeight: 500, marginTop: 5, marginBottom: 24, textAlign: "center", letterSpacing: "0.08em", textShadow: "0 6px 16px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.18)" }}>Type the correct morse code base on the given letter.</h1>
      {mode !== null && !finished && (
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
            {/* Clear button */}
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
      )}
      {mode !== null && !finished && (
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
      )}
    </div>
  );
};

export default SignalStarter;
