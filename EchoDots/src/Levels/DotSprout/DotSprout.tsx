import React, { useState, useEffect } from "react";
import styles from "./DotSprout.module.css";

// Morse code map
const morseMap: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--.."
};
const letters = Object.keys(morseMap);

// Simple beep sound generator for Morse code
interface PlayMorseFn {
  (morse: string): void;
  ctx?: AudioContext;
  currentOscs?: OscillatorNode[];
}
const playMorse: PlayMorseFn = function(morse: string) {
  const win = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  if (!playMorse.ctx) {
    playMorse.ctx = new (win.AudioContext || win.webkitAudioContext!)();
  }
  const ctx: AudioContext = playMorse.ctx!;
  if (playMorse.currentOscs && playMorse.currentOscs.length > 0) {
    playMorse.currentOscs.forEach((osc: OscillatorNode) => {
      try { osc.stop(); } catch { /* ignore */ }
    });
  }
  playMorse.currentOscs = [];
  let time = ctx.currentTime;
  morse.split("").forEach((char) => {
    let osc: OscillatorNode | null = null;
    if (char === ".") {
      osc = ctx.createOscillator();
      if (osc) {
        osc.type = "sine";
        osc.frequency.value = 700;
        osc.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.15);
      }
      time += 0.2;
    } else if (char === "-") {
      osc = ctx.createOscillator();
      if (osc) {
        osc.type = "sine";
        osc.frequency.value = 700;
        osc.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.45);
      }
      time += 0.5;
    }
    if (osc) playMorse.currentOscs!.push(osc);
    time += 0.05;
  });
}
playMorse.ctx = undefined;
playMorse.currentOscs = [];
// Attach static properties to playMorse for context and oscillators
(playMorse as { ctx?: AudioContext; currentOscs?: OscillatorNode[] }).ctx = undefined;
(playMorse as { ctx?: AudioContext; currentOscs?: OscillatorNode[] }).currentOscs = [];

const DotSprout: React.FC = () => {
  const [challengeLetter, setChallengeLetter] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBtnHovered, setPlayBtnHovered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [showSelection, setShowSelection] = useState(true);
  const [questionLimit, setQuestionLimit] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [quizDone, setQuizDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

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

  // Randomize challenge letter on mount and after correct answer
  useEffect(() => {
    if (!showSelection) {
      randomizeChallenge();
    }
  }, [showSelection]);

  // Play sound automatically when challengeLetter changes (not on initial selection modal)
  useEffect(() => {
    if (challengeLetter && !showSelection) {
      setTimeout(() => handlePlay(), 200); // slight delay for UX
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeLetter]);

  function randomizeChallenge() {
    const idx = Math.floor(Math.random() * letters.length);
    setChallengeLetter(letters[idx]);
    setSelected(null);
    setResult(null);
  }

  function handlePlay() {
    if (!challengeLetter || isPlaying) return;
    setIsPlaying(true);
    playMorse(morseMap[challengeLetter]);
    const duration = getMorseDuration(morseMap[challengeLetter]);
    setTimeout(() => setIsPlaying(false), duration * 1000);
  }

  function handleSelect(letter: string) {
    if (isPlaying) return;
    setSelected(letter);
    if (questionLimit && questionCount >= questionLimit) {
      // Last question, show result then finish
      if (letter === challengeLetter) {
        setResult("correct");
        setTimeout(() => {
          setResult(null);
          setQuizDone(true);
        }, 2000);
      } else {
        setResult("wrong");
        setLastAnswer(challengeLetter);
        setTimeout(() => {
          setResult(null);
          setQuizDone(true);
        }, 2000);
      }
    } else {
      // Not last question
      if (letter === challengeLetter) {
        setResult("correct");
      } else {
        setResult("wrong");
        setLastAnswer(challengeLetter);
      }
      setTimeout(() => {
        setResult(null);
        setQuestionCount((c) => c + 1);
        randomizeChallenge();
      }, 2000);
    }
  }

  return (
    <div className={styles.bg}>
      {/* Selection modal at start */}
      {showSelection && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2.2rem', textAlign: 'center' }}>Selection Mode</div>
            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.5rem', justifyContent: 'center' }}>
              <button className={styles.selectBtn} onClick={() => { setQuestionLimit(10); setShowSelection(false); setQuestionCount(1); setQuizDone(false); }}>10 Letters</button>
              <button className={styles.selectBtn} onClick={() => { setQuestionLimit(20); setShowSelection(false); setQuestionCount(1); setQuizDone(false); }}>20 Letters</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className={styles.selectBtn} style={{ minWidth: 220 }} onClick={() => { setQuestionLimit(30); setShowSelection(false); setQuestionCount(1); setQuizDone(false); }}>30 Letters</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal overlay for correct/incorrect */}
      {result && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            {result === "correct" ? (
              <>
                <div className={styles.modalCorrect}>Correct</div>
              </>
            ) : (
              <>
                <div className={styles.modalIncorrect}>Incorrect</div>
                <div className={styles.modalAnswer}>It is ‘{lastAnswer}’</div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Quiz done modal */}
      {quizDone && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff', marginBottom: '2.2rem', textAlign: 'center' }}>Challenge Result</div>
            <div style={{ fontSize: '3.5rem', color: '#fff', fontWeight: 600, textAlign: 'center', marginBottom: '2.5rem', lineHeight: 1.1 }}>
              <div>{correctCount}</div>
              <div style={{ borderBottom: '3px solid #fff', width: '2.5em', margin: '0.1em auto 0.1em auto' }}></div>
              <div>{questionLimit}</div>
            </div>
            <button className={styles.selectBtn} style={{ fontSize: '1.2rem', padding: '0.7em 2.2em', minWidth: 0 }} onClick={() => { setShowSelection(true); setQuizDone(false); setCorrectCount(0); }}>Select Mode</button>
          </div>
        </div>
      )}
      <button
        className={styles.backArrow}
        onClick={() => window.history.back()}
        aria-label="Back"
        onMouseEnter={e => { e.currentTarget.querySelector('span')!.style.color = '#000000ff'; }}
        onMouseLeave={e => { e.currentTarget.querySelector('span')!.style.color = '#d9d9d9'; }}
      >
        <span className={styles.arrow}>←</span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '0.5rem' }}>
        <h1 className={styles.title} style={{ marginRight: '1.5rem', marginBottom: 0 }}>Dot Sprout</h1>
        {questionLimit && (
          <div style={{
            position: 'absolute',
            left: 590,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.08)',
            border: '4px solid #d9d9b0',
            borderRadius: '3em',
            padding: '0.3em 1.2em',
            fontSize: '2rem',
            color: '#fff',
            fontWeight: 500,
            textAlign: 'center',
            fontFamily: 'Lexend, sans-serif',
            letterSpacing: '0.04em',
          }}>
            <div>{questionCount}</div>
            <div style={{ borderBottom: '2px solid #fff', width: '2em', margin: '0.1em auto 0.1em auto' }}></div>
            <div>{questionLimit}</div>
          </div>
        )}
      </div>
      <div className={styles.subtitle}>Choose the letter that matches the signal by tapping one of the buttons below.</div>
      <div className={styles.grid}>
        {/* Morse code display */}
        <div className={styles.morseBox}>
          <div className={styles.morseBoxInner}>
            <div className={styles.morseSymbols}>
              {challengeLetter ? morseMap[challengeLetter].split('').map((c, i) => (
                <span key={i} className={styles.morseSymbol}>
                  {c === "." ? <span className={styles.dot}></span> : <span className={styles.dash}></span>}
                </span>
              )) : <span className={styles.placeholder}>● —</span>}
            </div>
          </div>
          <button
            className={[
              styles.playBtn,
              playBtnHovered ? styles.playBtnHovered : '',
              isPlaying ? styles.disabled : ''
            ].join(' ')}
            onClick={handlePlay}
            onMouseEnter={() => setPlayBtnHovered(true)}
            onMouseLeave={() => setPlayBtnHovered(false)}
            disabled={isPlaying}
          >
            <span className={styles.playIcon}>▶</span> Play
          </button>
         
        </div>
        {/* Letter buttons */}
        <div className={styles.lettersBox}>
          <div className={styles.lettersGrid}>
            {letters.map((letter) => (
              <button
                key={letter}
                className={[
                  styles.letterBtn,
                  selected === letter ? styles.letterBtnSelected : '',
                  isPlaying ? styles.disabled : ''
                ].join(' ')}
                onClick={() => handleSelect(letter)}
                disabled={isPlaying}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DotSprout;
