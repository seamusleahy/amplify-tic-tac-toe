import React from "react";

import { Player } from "../gameLogic/gameBoard";
import styles from "./CurrentPlayerStatus.module.css";

export interface CurrentPlayerStatusProps {
  playerXName: string;
  playerOName: string;
  currentPlayersTurn: Player;
  viewersPlayer: Player | null;
}

const CurrentPlayerStatus: React.FunctionComponent<CurrentPlayerStatusProps> = ({
  playerXName,
  playerOName,
  currentPlayersTurn,
  viewersPlayer
}) => (
  <div
    className={`${styles.CurrentPlayerStatus} ${
      currentPlayersTurn === Player.X ? styles.xTurn : styles.oTurn
    }`}
  >
    {viewersPlayer === null ? (
      <div className={styles.observing}>
        You’re Observing {playerXName} and {playerOName}
      </div>
    ) : null}
    {currentPlayersTurn === viewersPlayer
      ? "Your Turn"
      : `${currentPlayersTurn === Player.X ? playerXName : playerOName}’s Turn`}
  </div>
);

export default CurrentPlayerStatus;
