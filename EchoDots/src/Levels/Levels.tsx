import React from "react";
import styles from "./Levels.module.css";

const levels = [
  { title: ["Dot", "Sprout"], subtitle: "Beginner" },
  { title: ["Signal", "Starter"], subtitle: "Novice" },
  { title: ["Pulse", "Operator"], subtitle: "Skilled" },
  { title: ["Echo", "Decoder"], subtitle: "Expert" },
  { title: ["Code", "Commander"], subtitle: "Master" },
];

const Levels: React.FC = () => {
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
          {levels.slice(0, 3).map((level) => (
            <div className={styles["level-card"]} key={level.title.join("-")}>
              <div className={styles["level-title"]}>
                {level.title.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
              <div className={styles["level-subtitle"]}>{level.subtitle}</div>
            </div>
          ))}
        </div>
        <div className={styles["levels-row"]}>
          {levels.slice(3).map((level) => (
            <div className={styles["level-card"]} key={level.title.join("-")}>
              <div className={styles["level-title"]}>
                {level.title.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
              <div className={styles["level-subtitle"]}>{level.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Levels;
