import React from "react";

import styles from "./Board.module.css";
import Cell, { CellUiState } from "./Cell";
import {
  CellPosition,
  GameBoard,
  CellState,
  Player,
  Win
} from "../gameLogic/gameBoard";
import Grid, { GridState } from "./Grid";

function toUiState(
  cellState: CellState,
  isSelectable: boolean,
  player: Player
): CellUiState {
  switch (cellState) {
    case CellState.X:
      return CellUiState.X;

    case CellState.O:
      return CellUiState.O;
  }

  if (isSelectable) {
    switch (player) {
      case Player.X:
        return CellUiState.SELECTABLE_X;

      case Player.O:
        return CellUiState.SELECTABLE_O;
    }
  }

  return CellUiState.EMPTY;
}

function getGridState(player: Player, hasWon: boolean) {
  if (hasWon) {
    return player === Player.X ? GridState.X_WINS : GridState.O_WINS; 
  }

  return player === Player.X ? GridState.X_TURN : GridState.O_TURN;
}

function getWinStatus(wins: Win[], position: CellPosition): (null | 0 | 1 | 2)[] {
  const r = wins.map((win) => {
    switch(position) {
      case CellPosition.TOP_LEFT:
        switch(win){
          case Win.COL0:
            return 2;
          case Win.ROW0:
            return 0;
          case Win.DIAGONAL_TOP_LEFT_TO_BOTTOM_RIGHT:
            return 0;
          default:
            return null;
        }
      
      case CellPosition.TOP_CENTER:
        switch(win){
          case Win.COL1:
            return 2;
          case Win.ROW0:
            return 1;
          default:
            return null;
        }
      
      case CellPosition.TOP_RIGHT:
        switch(win){
          case Win.COL2:
            return 2;
          case Win.ROW0:
            return 2;
          case Win.DIAGONAL_BOTTOM_LEFT_TO_TOP_RIGHT:
            return 2;
          default:
            return null;
        }

      case CellPosition.MIDDLE_LEFT:
        switch(win){
          case Win.COL0:
            return 1;
          case Win.ROW1:
            return 0;
          default:
            return null;
        }
      
      case CellPosition.MIDDLE_CENTER:
        switch(win){
          case Win.COL1:
          case Win.ROW1:
          case Win.DIAGONAL_TOP_LEFT_TO_BOTTOM_RIGHT:
          case Win.DIAGONAL_BOTTOM_LEFT_TO_TOP_RIGHT:
            return 1;
          default:
            return null;
        }
      
      case CellPosition.MIDDLE_RIGHT:
        switch(win){
          case Win.COL2:
            return 1;
          case Win.ROW1:
            return 2;
          default:
            return null;
        }

      case CellPosition.BOTTOM_LEFT:
        switch(win){
          case Win.COL0:
            return 0;
          case Win.ROW2:
            return 0;
          case Win.DIAGONAL_BOTTOM_LEFT_TO_TOP_RIGHT:
            return 0;
          default:
            return null;
        }
      
      case CellPosition.BOTTOM_CENTER:
        switch(win){
          case Win.COL1:
            return 0;
          case Win.ROW2:
            return 1;
          default:
            return null;
        }
      
      case CellPosition.BOTTOM_RIGHT:
        switch(win){
          case Win.COL2:
            return 0;
          case Win.ROW2:
            return 2;
          case Win.DIAGONAL_TOP_LEFT_TO_BOTTOM_RIGHT:
            return 2;
          default:
            return null;
        }
    }

    return null;
  });

  return r;
}

interface BoardProps {
  onSelected: (cellPosition: CellPosition) => void;
  board: GameBoard;
  isSelectable: boolean;
  player: Player;
  wins: Win[];
}

const Board: React.FunctionComponent<BoardProps> = ({
  onSelected,
  board,
  isSelectable,
  player,
  wins
}) => (
  <div className={styles.wrapper}>
    <div className={styles.Board}>
      <div className={styles.grid}>
        <Grid state={getGridState(player, wins.length > 0)} />
      </div>
      {/* Top row */}
      <Cell
        className={`${styles.cell} ${styles.cell0}`}
        state={toUiState(board[0], isSelectable, player)}
        position={CellPosition.TOP_LEFT}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.TOP_LEFT)}
      />
      <Cell
        className={`${styles.cell} ${styles.cell1}`}
        state={toUiState(board[1], isSelectable, player)}
        position={CellPosition.TOP_CENTER}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.TOP_CENTER)}
      />
      <Cell
        className={`${styles.cell} ${styles.cell2}`}
        state={toUiState(board[2], isSelectable, player)}
        position={CellPosition.TOP_RIGHT}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.TOP_RIGHT)}
      />

      {/* Middle row */}
      <Cell
        className={`${styles.cell} ${styles.cell3}`}
        state={toUiState(board[3], isSelectable, player)}
        position={CellPosition.MIDDLE_LEFT}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.MIDDLE_LEFT)}
      />
      <Cell
        className={`${styles.cell} ${styles.cell4}`}
        state={toUiState(board[4], isSelectable, player)}
        position={CellPosition.MIDDLE_CENTER}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.MIDDLE_CENTER)}
      />
      <Cell
        className={`${styles.cell} ${styles.cell5}`}
        state={toUiState(board[5], isSelectable, player)}
        position={CellPosition.MIDDLE_RIGHT}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.MIDDLE_RIGHT)}
      />

      {/* Bottom Row */}
      <Cell
        className={`${styles.cell} ${styles.cell6}`}
        state={toUiState(board[6], isSelectable, player)}
        position={CellPosition.BOTTOM_LEFT}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.BOTTOM_LEFT)}
      />
      <Cell
        className={`${styles.cell} ${styles.cell7}`}
        state={toUiState(board[7], isSelectable, player)}
        position={CellPosition.BOTTOM_CENTER}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.BOTTOM_CENTER)}
      />
      <Cell
        className={`${styles.cell} ${styles.cell8}`}
        state={toUiState(board[8], isSelectable, player)}
        position={CellPosition.BOTTOM_RIGHT}
        onSelected={onSelected}
        winAnimOrder={getWinStatus(wins, CellPosition.BOTTOM_RIGHT)}
      />
    </div>
  </div>
);

export default Board;
