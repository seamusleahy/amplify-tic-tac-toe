import React from "react";

import styles from "./PlayAgainButton.module.css";

interface PlayAgainButtonProps {
  callback: () => void;
  className?: string;
}

const PlayAgainButton: React.FunctionComponent<PlayAgainButtonProps> = ({
  callback,
  className
}) => (
  <div className={`${styles.wrapper} ${className}`}>
    <button className={styles.PlayAgainButton} onClick={callback}>
      <span className={styles.text}>Play Again!</span>
    </button>
  </div>
);

export default PlayAgainButton;
