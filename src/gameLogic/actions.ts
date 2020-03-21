import { Player, GameBoard } from "./gameBoard";

export enum ActionTypes {
  INITIALIZE = "INITIALIZE",
  SET_NAME = "SET_NAME",
  JOIN_GAME_AS_PLAYER_O = "JOIN_GAME_AS_PLAYER_O",
  JOIN_GAME_AS_PLAYER_X = "JOIN_GAME_AS_PLAYER_X",
  WATCH_GAME_AS_OBSERVER = "WATCH_GAME_AS_OBSERVER",
  TAKE_TURN = "TAKE_TURN",
  START_NEW_GAME = "START_NEW_GAME",
}
export type InitializeAction = {
  type: ActionTypes.INITIALIZE;
  payload: {
    gameId: string;
  };
};

export type SetNameAction = {
  type: ActionTypes.SET_NAME;
  payload: {
    name: string;
  };
};

export type JoinGameAsPlayerOAction = {
  type: ActionTypes.JOIN_GAME_AS_PLAYER_O;
  payload: {
    playerXName: string;
  };
};

export type JoinGameAsPlayerXAction = {
  type: ActionTypes.JOIN_GAME_AS_PLAYER_X;
  payload: {
    playerOName: string;
  };
};

export type WatchGameAsObserverAction = {
  type: ActionTypes.WATCH_GAME_AS_OBSERVER;
  payload: {
    playerXName: string;
    playerOName: string;
    startingPlayer: Player;
    turn: number;
    gameBoard: GameBoard;
  };
};

export type TakeTurnAction = {
  type: ActionTypes.TAKE_TURN;
  payload: {
    gameBoard: GameBoard;
  };
};

export type StartNewGameAction = {
  type: ActionTypes.START_NEW_GAME;
};

export type Action =
  | InitializeAction
  | SetNameAction
  | JoinGameAsPlayerOAction
  | JoinGameAsPlayerXAction
  | WatchGameAsObserverAction
  | TakeTurnAction
  | StartNewGameAction;

export function createInitializeAction(gameId: string): InitializeAction {
  return {
    type: ActionTypes.INITIALIZE,
    payload: {
      gameId
    }
  };
}

export function createSetNameAction(name: string): SetNameAction {
  if (name === "") {
    throw new TypeError("The name cannot be empty");
  }

  return {
    type: ActionTypes.SET_NAME,
    payload: {
      name
    }
  };
}

export function createJoinGameAsPlayerOAction(
  playerXName: string
): JoinGameAsPlayerOAction {
  return {
    type: ActionTypes.JOIN_GAME_AS_PLAYER_O,
    payload: {
      playerXName
    }
  };
}

export function createJoinGameAsPlayerXAction(
  playerOName: string
): JoinGameAsPlayerXAction {
  return {
    type: ActionTypes.JOIN_GAME_AS_PLAYER_X,
    payload: {
      playerOName
    }
  };
}

export function createWatchGameAsObserverAction(
  playerXName: string,
  playerOName: string,
  startingPlayer: Player,
  gameBoard: GameBoard,
  turn: number,
): WatchGameAsObserverAction {
  return {
    type: ActionTypes.WATCH_GAME_AS_OBSERVER,
    payload: {
      playerXName,
      playerOName,
      turn,
      gameBoard,
      startingPlayer,
    }
  };
}

export function createTakeTurnAction(gameBoard: GameBoard): TakeTurnAction {
  return {
    type: ActionTypes.TAKE_TURN,
    payload: {
      gameBoard
    }
  };
}

export function createStartNewGameAction(): StartNewGameAction {
  return {
    type: ActionTypes.START_NEW_GAME
  };
}

// For Redux Devtools
export const actionCreators = {
  createInitializeAction,
  createSetNameAction,
  createJoinGameAsPlayerOAction,
  createJoinGameAsPlayerXAction,
  createWatchGameAsObserverAction,
  createTakeTurnAction,
  createStartNewGameAction,
};
