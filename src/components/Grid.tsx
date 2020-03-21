import React from "react";

import styles from "./Grid.module.css";

export enum GridState {
  DEFAULT,
  X_TURN,
  O_TURN,
  X_WINS,
  O_WINS
}

const StateClassNames = new Map<GridState, string>([
  [GridState.X_TURN, styles.xTurn],
  [GridState.O_TURN, styles.oTurn],
  [GridState.X_WINS, styles.xWins],
  [GridState.O_WINS, styles.oWins]
]);

export interface GridProps {
  state: GridState;
}

const Grid: React.FunctionComponent<GridProps> = ({ state }) => (
  <svg
    className={`${styles.Grid} ${StateClassNames.get(state) || ""}`}
    viewBox="0 0 601 601"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M403.296 0.796387C407.439 0.796387 410.796 4.15425 410.796 8.29639V191.796H593.296C597.439 191.796 600.796 195.154 600.796 199.296C600.796 203.439 597.439 206.796 593.296 206.796H410.796L410.796 395.796H593.296C597.439 395.796 600.796 399.154 600.796 403.296C600.796 407.439 597.439 410.796 593.296 410.796H410.796V593.296C410.796 597.439 407.438 600.796 403.296 600.796C399.154 600.796 395.796 597.439 395.796 593.296V410.796H205.796L205.796 593.296C205.796 597.439 202.438 600.796 198.296 600.796C194.154 600.796 190.796 597.439 190.796 593.296L190.796 410.796H8.29636C4.15422 410.796 0.796356 407.439 0.796356 403.296C0.796356 399.154 4.15422 395.796 8.29636 395.796H190.796V206.796H8.29639C4.15425 206.796 0.796387 203.439 0.796387 199.296C0.796387 195.154 4.15425 191.796 8.29639 191.796H190.796L190.796 8.29639C190.796 4.15425 194.154 0.796387 198.296 0.796387C202.438 0.796387 205.796 4.15425 205.796 8.29639L205.796 191.796H395.796V8.29639C395.796 4.15425 399.154 0.796387 403.296 0.796387ZM205.796 206.796V395.796H395.796L395.796 206.796H205.796Z"
      fill="url(#grid-gradient)"
    />
    <defs>
      <linearGradient
        id="grid-gradient"
        x1="17.9698"
        y1="11.5035"
        x2="584.894"
        y2="580.045"
        gradientUnits="userSpaceOnUse"
      >
        <stop className={styles.color0} offset="0%" />
        <stop className={styles.color50} offset="50%" />
        <stop className={styles.color100} offset="100%" />
      </linearGradient>
    </defs>
  </svg>
);

export default Grid;
