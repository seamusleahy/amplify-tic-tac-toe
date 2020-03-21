import { Reducer, Store, createStore } from "redux";

import {
  Action,
  ActionTypes,
  InitializeAction,
  SetNameAction,
  JoinGameAsPlayerOAction,
  JoinGameAsPlayerXAction,
  WatchGameAsObserverAction,
  TakeTurnAction,
  StartNewGameAction,
  actionCreators
} from "./actions";
import { GameBoard, Player, newGameBoard, findWins } from "./gameBoard";

export enum States {
  INITIAL = "INITIAL",
  WAITING_FOR_NAME = "WAITING_FOR_NAME",
  WAITING_TO_JOIN = "WAITING_TO_JOIN",
  TURN = "TURN",
  GAME_END = "GAME_END"
}

type StateStructure = {
  state: States;
  gameId: string;
  player: null | Player;
  playersName: string;
  playerXName: string;
  playerOName: string;
  startingPlayer: Player;
  gameBoard: GameBoard;
  turn: number;
};

export const initialState: StateStructure = {
  state: States.INITIAL,
  gameId: "",
  player: null,
  playersName: "",
  playerXName: "",
  playerOName: "",
  startingPlayer: Player.X,
  gameBoard: newGameBoard(),
  turn: 0
};

// The key side is the "from" state and the value side is the "to" state
const validForwardStateTransitionsMapping = {
  [States.INITIAL]: [States.WAITING_FOR_NAME],
  [States.WAITING_FOR_NAME]: [States.WAITING_TO_JOIN],
  [States.WAITING_TO_JOIN]: [States.TURN, States.GAME_END],
  [States.TURN]: [States.TURN, States.GAME_END],
  [States.GAME_END]: [States.TURN]
};

class InvalidStateTransition extends Error {}

function assertValidStateTransition(from: States, to: States) {
  if (!validForwardStateTransitionsMapping[from].includes(to)) {
    throw new InvalidStateTransition(
      `Cannot transition from state '${from}' to '${to}'`
    );
  }
}

type SubReducer<ACT> = (state: StateStructure, action: ACT) => StateStructure;

const initializeReducer: SubReducer<InitializeAction> = (prevState, action) => {
  return {
    ...prevState,
    state: States.WAITING_FOR_NAME,
    gameId: action.payload.gameId
  };
};

const setNameReducer: SubReducer<SetNameAction> = (prevState, action) => {
  assertValidStateTransition(prevState.state, States.WAITING_TO_JOIN);

  return {
    ...prevState,
    state: States.WAITING_TO_JOIN,
    playersName: action.payload.name
  };
};

const joinGameAsPlayerReducer: SubReducer<
  JoinGameAsPlayerOAction | JoinGameAsPlayerXAction
> = (prevState, action) => {
  assertValidStateTransition(prevState.state, States.TURN);
  const playerOName =
    (action as JoinGameAsPlayerXAction).payload.playerOName ||
    prevState.playersName;
  const playerXName =
    (action as JoinGameAsPlayerOAction).payload.playerXName ||
    prevState.playersName;

  const player =
    action.type === ActionTypes.JOIN_GAME_AS_PLAYER_X ? Player.X : Player.O;

  return {
    ...prevState,
    state: States.TURN,
    playerOName,
    playerXName,
    player
  };
};

const watchGameAsObserverReducer: SubReducer<WatchGameAsObserverAction> = (
  prevState,
  action
) => {
  assertValidStateTransition(prevState.state, States.TURN);
  assertValidStateTransition(prevState.state, States.GAME_END);

  const {
    gameBoard,
    startingPlayer,
    playerOName,
    playerXName,
    turn
  } = action.payload;

  const state = findWins(gameBoard).length > 0 ? States.GAME_END : States.TURN;

  return {
    ...prevState,
    state,
    gameBoard,
    playerXName,
    playerOName,
    startingPlayer,
    turn
  };
};

const takeTurnReducer: SubReducer<TakeTurnAction> = (prevState, action) => {
  assertValidStateTransition(prevState.state, States.TURN);
  assertValidStateTransition(prevState.state, States.GAME_END);

  if (prevState.turn === 8 || findWins(action.payload.gameBoard).length > 0) {
    // Player who just played won or finished in a tie
    return {
      ...prevState,
      state: States.GAME_END,
      gameBoard: action.payload.gameBoard
    };
  } else {
    // Next play
    return {
      ...prevState,
      turn: prevState.turn + 1,
      gameBoard: action.payload.gameBoard
    };
  }
};

const startNewGameReducer: SubReducer<StartNewGameAction> = prevState => {
  assertValidStateTransition(prevState.state, States.TURN);

  // Swap the starting player
  const startingPlayer =
    prevState.startingPlayer === Player.X ? Player.O : Player.X;

  return {
    ...prevState,
    startingPlayer,
    state: States.TURN,
    turn: 0,
    gameBoard: newGameBoard()
  };
};

export type StoreType = Store<StateStructure, Action>;

export const reducer: Reducer<StateStructure, Action> = (
  previousState,
  action
) => {
  let prevState: StateStructure = previousState || initialState;

  switch (action.type) {
    case ActionTypes.INITIALIZE:
      return initializeReducer(prevState, action);

    case ActionTypes.SET_NAME:
      return setNameReducer(prevState, action);

    case ActionTypes.JOIN_GAME_AS_PLAYER_X:
    case ActionTypes.JOIN_GAME_AS_PLAYER_O:
      return joinGameAsPlayerReducer(prevState, action);

    case ActionTypes.WATCH_GAME_AS_OBSERVER:
      return watchGameAsObserverReducer(prevState, action);

    case ActionTypes.TAKE_TURN:
      return takeTurnReducer(prevState, action);

    case ActionTypes.START_NEW_GAME:
      return startNewGameReducer(prevState, action);

    default:
      return prevState;
  }
};

export function createGameStore() {
  return createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__({
        // Random number for when multiple windows have devtools opened
        name: `TicTacToe-${Date.now()}`,
        trace: true,
        actionCreators
      })
  );
}
