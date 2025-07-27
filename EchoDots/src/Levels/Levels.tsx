import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Levels.module.css";

const levels = [
  { title: ["Dot", "Sprout"], subtitle: "Beginner" },
  { title: ["Signal", "Starter"], subtitle: "Novice" },
  { title: ["Pulse", "Operator"], subtitle: "Skilled" },
  { title: ["Echo", "Decoder"], subtitle: "Expert" },
  { title: ["Code", "Commander"], subtitle: "Master" },
];

const Levels: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["levels-bg"]}>
      <button
        className={styles["levels-back-arrow"]}
        onClick={() => window.history.back()}
        aria-label="Back"
      >
        <span className={styles["arrow"]}>←</span>
      </button>
      <h1 className={styles["levels-title"]}>Test Your skills</h1>
      <div className={styles["levels-grid"]}>
        <div className={styles["levels-row"]}>
          {levels.slice(0, 3).map((level, idx) => (
            <div
              className={styles["level-card"]}
              key={level.title.join("-")}
              onClick={
              idx === 0
                ? () => navigate("/DotSprout")
                : idx === 1
                ? () => navigate("/SignalStarter")
                : idx === 2
                ? () => navigate("/PulseOperator")
                : undefined
              }
              style={idx === 0 || idx === 1 || idx === 2 ? { cursor: "pointer" } : {}}
            >
              <div className={styles["level-title"]}>
                {level.title.map((line, idx2) => (
                  <div key={idx2}>{line}</div>
                ))}
              </div>
              <div className={styles["level-subtitle"]}>{level.subtitle}</div>
            </div>
          ))}
        </div>
        <div className={styles["levels-row"]}>
          {levels.slice(3).map((level) => (
            <div
              className={`${styles["level-card"]} ${styles["level-locked"]}`}
              key={level.title.join("-")}
              style={{
                cursor: "not-allowed",
                opacity: 0.5,
                position: "relative"
              }}
              aria-disabled="true"
            >
              <div className={styles["level-title"]}>
                {level.title.map((line, idx2) => (
                  <div key={idx2}>{line}</div>
                ))}
              </div>
              <div className={styles["level-subtitle"]}>{level.subtitle}</div>
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  fontSize: "2rem",
                  color: "#bdbdbd",
                  fontWeight: "bold",
                  pointerEvents: "none",
                  userSelect: "none"
                }}
                aria-label="Locked"
              >
                🔒
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Levels;
