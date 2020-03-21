import React from "react";
import { Link } from "react-router-dom";

import styles from "./NewGameLink.module.css";

function generateNewGamePath() {
  const characters = "0123456789QWERTYUIOPASDFGHJKLZXCVBNM";
  const idChars = [];

  for (let i = 0; i < 10; ++i) {
    const rand = Math.random() * characters.length;
    const char = characters.charAt(rand);
    idChars.push(char);
  }

  const gameId = idChars.join("");
  return `/${gameId}`;
}

const NewGameLink: React.FunctionComponent = () => (
  <div className={styles.NewGameLink}>
    <Link to={generateNewGamePath} className={styles.link}>
      <span className={styles.linkText}>Play</span>
    </Link>
  </div>
);

export default NewGameLink;
