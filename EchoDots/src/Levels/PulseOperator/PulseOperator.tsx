import React, { useState } from "react";
import styles from "./PulseOperator.module.css";

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

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

// Add this function to stop all Morse code sounds
function stopMorse() {
  if (currentOscs.length > 0) {
    currentOscs.forEach((osc) => { try { osc.stop(); } catch { /* empty */ } });
    currentOscs = [];
  }
}

const PulseOperator: React.FC = () => {
  const [mode, setMode] = useState<null | number>(null);
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [playHovered, setPlayHovered] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [selectHovered, setSelectHovered] = useState(false); // Add this with other useState
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0); // <-- Add score state

  // Open selection modal at start
  React.useEffect(() => {
    if (mode === null) {
      setInput("");
      setResult(null);
      setFinished(false);
      setCurrentIdx(0);
      setScore(0); // Reset score on mode select
    }
  }, [mode]);

  const handleModeSelect = (count: number) => {
    const shuffled = shuffle(words).slice(0, count);
    setWordList(shuffled);
    setCurrentIdx(0);
    setMode(count);
    setInput("");
    setResult(null);
    setFinished(false);
    setScore(0); // Reset score
    setTimeout(() => {
      playMorse(textToMorse(shuffled[0]));
    }, 100);
  };

  const handlePlay = () => {
    if (wordList.length > 0 && currentIdx < wordList.length) {
      playMorse(textToMorse(wordList[currentIdx]));
    }
  };

  const handleSubmit = () => {
    // Stop Morse code sound immediately when modal appears
    stopMorse();

    if (input.trim().toUpperCase() === wordList[currentIdx]) {
      setResult(true);
      setScore((prev) => prev + 1); // Increment score
      setTimeout(() => {
        setResult(null);
        setInput("");
        if (currentIdx + 1 < wordList.length) {
          setCurrentIdx(currentIdx + 1);
          // Play Morse code for the next word after modal disappears
          setTimeout(() => {
            playMorse(textToMorse(wordList[currentIdx + 1]));
          }, 100);
        } else {
          setFinished(true);
        }
      }, 1200);
    } else {
      setResult(false);
      setTimeout(() => {
        setResult(null);
        setInput("");
        if (currentIdx + 1 < wordList.length) {
          setCurrentIdx(currentIdx + 1);
          // Play Morse code for the next word after modal disappears
          setTimeout(() => {
            playMorse(textToMorse(wordList[currentIdx + 1]));
          }, 100);
        } else {
          setFinished(true);
        }
      }, 2000);
    }
  };

  const handleRestart = () => {
    setMode(null);
    setWordList([]);
    setCurrentIdx(0);
    setInput("");
    setResult(null);
    setFinished(false);
    setScore(0);
  };

  // Stop Morse code sound when finished modal is shown
  React.useEffect(() => {
    if (finished) {
      stopMorse();
    }
  }, [finished]);

  return (
    <div className={styles.container}>
      {/* Selection Mode Modal */}
      {mode === null && (
        <div className={styles.modalOverlay}>
          <div className={styles.selectionModal}>
            <div className={styles.selectionTitle}>Selection Mode</div>
            <div className={styles.selectionRow}>
              <button
                className={styles.selectionButton}
                onClick={() => handleModeSelect(5)}
              >
                5 Words
              </button>
              <button
                className={styles.selectionButton}
                onClick={() => handleModeSelect(10)}
              >
                10 Words
              </button>
            </div>
            <button
              className={styles.selectionButton}
              style={{ display: "block", margin: "0 auto" }}
              onClick={() => handleModeSelect(20)}
            >
              20 Words
            </button>
          </div>
        </div>
      )}

      {/* Back Arrow */}
      <button
        className={styles.backButton}
        onClick={() => { window.history.back(); stopMorse(); }} // Stop Morse code sound when going back
        aria-label="Back"
      >
        ←
      </button>
      {/* Title */}
      <h1 className={styles.title}>Pulse Operator</h1>
      <h1 className={styles.subtitle}>
        Listen closely to the Morse signal sequence.
      </h1>
      {/* Play Button */}
      {mode !== null && !finished && (
        <div className={styles.playRow}>
          <button
            className={`${styles.playButton} ${playHovered ? styles.playButtonHover : ""}`}
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
      )}
      {/* Input Box */}
      {mode !== null && !finished && (
        <div className={styles.inputRow}>
          <div className={styles.inputBox}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Input Text"
              className={styles.input}
              autoFocus
              onKeyDown={e => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
          <button
            className={`${styles.submitButton} ${submitHovered ? styles.submitButtonHover : ""}`}
            onClick={handleSubmit}
            onMouseEnter={() => setSubmitHovered(true)}
            onMouseLeave={() => setSubmitHovered(false)}
          >
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <path d="M6 18L30 6L24 30L18 24L6 18Z" stroke="#222" strokeWidth="3" fill="none" />
            </svg>
          </button>
        </div>
      )}
      {/* Result Modal */}
      {result !== null && (
        <div className={styles.modalOverlay} onClick={() => setResult(null)}>
          <div className={styles.resultModal}>
            <div className={styles.resultTitle}>
              {result ? "Correct" : "Incorrect"}
            </div>
            {!result && (
              <>
                <div className={styles.resultLabel}>Correct answer</div>
                <div className={styles.resultAnswer}>{wordList[currentIdx]}</div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Finished Modal */}
      {finished && (
        <div className={styles.modalOverlay}>
          <div className={styles.finishedModal}>
            <div className={styles.finishedTitle}>Challenge Result</div>
            <div className={styles.finishedScore}>
              <span>{score}</span>
              <div className={styles.finishedDivider} />
              <span>{mode}</span>
            </div>
            <button
              className={`${styles.selectButton} ${selectHovered ? styles.selectButtonHover : ""}`}
              onClick={handleRestart}
              onMouseEnter={() => setSelectHovered(true)}
              onMouseLeave={() => setSelectHovered(false)}
            >
              Select Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PulseOperator;