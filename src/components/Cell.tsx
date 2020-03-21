import React from "react";

import styles from "./Cell.module.css";

import { CellPosition } from "../gameLogic/gameBoard";

export enum CellUiState {
  EMPTY,
  SELECTABLE_X,
  SELECTABLE_O,
  X,
  O
}

const cellPositionLabel = {
  [CellPosition.TOP_LEFT]: "Top-left",
  [CellPosition.TOP_CENTER]: "Top-center",
  [CellPosition.TOP_RIGHT]: "Top-right",
  [CellPosition.MIDDLE_LEFT]: "Middle-left",
  [CellPosition.MIDDLE_CENTER]: "Middle-center",
  [CellPosition.MIDDLE_RIGHT]: "Middle-right",
  [CellPosition.BOTTOM_LEFT]: "Bottom-left",
  [CellPosition.BOTTOM_CENTER]: "Bottom-center",
  [CellPosition.BOTTOM_RIGHT]: "Bottom-right"
};

const OShape = () => (
  <svg viewBox="0 0 159 159">
    <g filter="url(#o-filter)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M79.7964 134.796C110.172 134.796 134.796 110.172 134.796 79.7964C134.796 49.4207 110.172 24.7964 79.7964 24.7964C49.4207 24.7964 24.7964 49.4207 24.7964 79.7964C24.7964 110.172 49.4207 134.796 79.7964 134.796ZM79.7964 154.796C121.218 154.796 154.796 121.218 154.796 79.7964C154.796 38.375 121.218 4.79639 79.7964 4.79639C38.375 4.79639 4.79636 38.375 4.79636 79.7964C4.79636 121.218 38.375 154.796 79.7964 154.796Z"
        fill="#F53993"
      />
    </g>
    <defs>
      <filter
        id="o-filter"
        x="0.796356"
        y="0.796387"
        width="158"
        height="158"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const XShape = () => (
  <svg viewBox="0 0 166 166">
    <g filter="url(#x-filter)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M147.632 161.774L4.79652 18.9385L18.9387 4.79639L161.774 147.632L147.632 161.774Z"
        fill="#47E8FE"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.79641 147.632L147.632 4.79634L161.774 18.9385L18.9385 161.774L4.79641 147.632Z"
        fill="#47E8FE"
      />
    </g>
    <defs>
      <filter
        id="x-filter"
        x="0.796387"
        y="0.796387"
        width="164.978"
        height="164.978"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

function getWinAnimClassName(winAnimOrder: (null | 0 | 1 | 2)[]) {
  if (winAnimOrder.length === 0) {
    return "";
  }

  if (winAnimOrder.length === 1) {
    if (winAnimOrder[0] !== null) {
      return `${styles.winSingle} ${styles[`winSingle${winAnimOrder[0]}`]}`;
    }
    return "";
  }

  if (winAnimOrder.length === 2) {
    if (winAnimOrder[0] === null && winAnimOrder[1] === null) {
      return "";
    }
    if (winAnimOrder[0] !== null && winAnimOrder[1] === null) {
      return `${styles.winDouble} ${styles[`winDouble${winAnimOrder[0]}`]}`;
    }
    if (winAnimOrder[0] === null && winAnimOrder[1] !== null) {
      return `${styles.winDouble} ${styles[`winDouble${winAnimOrder[1] + 3}`]}`;
    }
    return `${styles.winDouble} ${
      styles[`winDouble${winAnimOrder[0]}${(winAnimOrder[1] as number) + 3}`]
    }`;
  }

  return "";
}

interface CellProps {
  state: CellUiState;
  className?: string;
  position: CellPosition;
  onSelected: (position: CellPosition) => void;
  winAnimOrder: (null | 0 | 1 | 2)[];
}

const Cell: React.FunctionComponent<CellProps> = ({
  state,
  position,
  className = "",
  onSelected,
  winAnimOrder
}) => {
  if (
    state === CellUiState.SELECTABLE_O ||
    state === CellUiState.SELECTABLE_X
  ) {
    const icon = state === CellUiState.SELECTABLE_O ? <OShape /> : <XShape />;

    const labelText = cellPositionLabel[position];
    const label = (
      <span className={styles.hiddenText}>{`Select ${labelText}`}</span>
    );

    return (
      <div className={`${className} ${styles.Cell}`}>
        <button
          className={styles.selectButton}
          onClick={() => onSelected(position)}
        >
          {label}
          {icon}
        </button>
      </div>
    );
  }

  const icon =
    state === CellUiState.X ? (
      <XShape />
    ) : state === CellUiState.O ? (
      <OShape />
    ) : (
      ""
    );

  const labelText = cellPositionLabel[position];
  const stateText =
    state === CellUiState.X ? "X" : state === CellUiState.O ? "O" : "Empty";
  const label = (
    <span className={styles.hiddenText}>{`${labelText}: ${stateText}`}</span>
  );

  return (
    <div
      className={`${className} ${styles.Cell} ${getWinAnimClassName(
        winAnimOrder
      )}`}
    >
      {label}
      {icon}
    </div>
  );
};

export default Cell;
