import React from "react";

import { Player } from "../gameLogic/gameBoard";

import styles from "./WinnerStatus.module.css";

function calcClassName(isWin: boolean, currentPlayersTurn: Player) {
  let cln = styles.WinnerStatus;

  if (isWin) {
    cln +=
      " " + (currentPlayersTurn === Player.X ? styles.xWins : styles.oWins);
  }

  return cln;
}

export interface WinnerStatusProps {
  playerXName: string;
  playerOName: string;
  currentPlayersTurn: Player;
  viewersPlayer: Player | null;
  isWin: boolean;
}

const WinnerStatus: React.FunctionComponent<WinnerStatusProps> = ({
  playerXName,
  playerOName,
  currentPlayersTurn,
  viewersPlayer,
  isWin
}) => (
  <div className={calcClassName(isWin, currentPlayersTurn)}>
    {viewersPlayer === null ? (
      <div className={styles.observing}>
        You’re Observing {playerXName} and {playerOName}
      </div>
    ) : null}

    {!isWin
      ? "Tie!"
      : currentPlayersTurn === viewersPlayer
      ? "You Won!"
      : `${currentPlayersTurn === Player.X ? playerXName : playerOName} Won!`}
  </div>
);

export default WinnerStatus;
