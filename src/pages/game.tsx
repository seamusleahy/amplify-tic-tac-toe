import React from "react";
import Amplify from "@aws-amplify/core";
import { API, graphqlOperation } from "aws-amplify";

import {
  Subscription,
  SubscriptionHandleArg,
  SubscriptionObservable
} from "../awsTypingsPolyfill";
import { createGameStore, StoreType, States } from "../gameLogic/stateMachine";
import {
  createInitializeAction,
  createSetNameAction,
  createJoinGameAsPlayerOAction,
  createJoinGameAsPlayerXAction,
  createStartNewGameAction,
  createTakeTurnAction,
  createWatchGameAsObserverAction
} from "../gameLogic/actions";
import awsConfig from "../aws-exports";

import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";
import {
  SubscribeSayHelloBackLetsPlaySubscription,
  SubscribeSayHelloBackWatchGameSubscription,
  SubscribeTakeTurnSubscription,
  SubscribeSayHelloSubscription,
  SubscribeStartNewGameSubscription
} from "../API";

import * as logGraphQl from "../logGraphQl";
import NamePrompt from "../components/NamePrompt";
import Board from "../components/Board";
import CurrentPlayerStatus from "../components/CurrentPlayerStatus";
import WinnerStatus from "../components/WinnerStatus";
import PlayAgainButton from "../components/PlayAgainButton";
import Error from "../components/Error";
import ShareUrl from "../components/ShareUrl";
import Background, {
  LogoOptions,
  BackgroundOptions
} from "../components/Background";
import WaitingForPlayerToJoin from "../components/WaitingForPlayerToJoin";
import {
  Player,
  findWins,
  CellPosition,
  selectCell,
  GameBoard,
  hashGameBoard
} from "../gameLogic/gameBoard";

import styles from "./game.module.css";

export const GAME_ID_MIN_LENGTH = 6;

Amplify.configure(awsConfig); // Configure Amplify

interface GamePageProps {
  match: {
    params: {
      gameId: string;
    };
  };
}

export default class GamePage extends React.Component<GamePageProps> {
  private gameId: string;
  private store: StoreType;
  private isConnectedToGameApi: boolean = false;
  private unsubscribeFromStore: null | (() => void) = null;

  private sayHelloSubscription: Subscription | null = null;
  private sayHelloBackLetsPlaySubscription: Subscription | null = null;
  private sayHelloBackWatchGameSubscription: Subscription | null = null;
  private takeTurnSubscription: Subscription | null = null;
  private startNewGameSubscription: Subscription | null = null;

  constructor(props: GamePageProps, context?: any) {
    super(props, context);
    this.store = createGameStore();

    this.gameId = props.match.params.gameId;
    if (this.gameId.length < GAME_ID_MIN_LENGTH) {
      throw new TypeError(
        `The game ID needs to be at least ${GAME_ID_MIN_LENGTH} characters long`
      );
    }
  }

  public componentWillMount() {
    this.store.dispatch(createInitializeAction(this.gameId));
    this.unsubscribeFromStore = this.store.subscribe(() => this.forceUpdate());
  }

  private onNameSet = (name: string) => {
    this.store.dispatch(createSetNameAction(name));
    this.connectToGameApi();
  };

  private async connectToGameApi() {
    const { state, playersName } = this.store.getState();
    const gameId = this.gameId;

    // --- Assert that we ready to connect to the game API ---
    if (state === States.INITIAL || state === States.WAITING_FOR_NAME) {
      console.error(
        "Attempting to connect to game API too soon before WAITING_TO_JOIN",
        state
      );
      return;
    }

    if (state !== States.WAITING_TO_JOIN) {
      console.error(
        "Attempting to connect to game API after WAITING_TO_JOIN",
        state
      );
      return;
    }

    if (this.isConnectedToGameApi) {
      console.error("Attempting to connect to game API multiple times", state);
      return;
    }

    this.isConnectedToGameApi = true;

    // --- Subscribe to events ---
    logGraphQl.logSubscribing(subscriptions.subscribeSayHello, { gameId });
    this.sayHelloSubscription = (API.graphql(
      graphqlOperation(subscriptions.subscribeSayHello, { gameId })
    ) as SubscriptionObservable<SubscribeSayHelloSubscription>).subscribe({
      next: this.handleSayHelloSubscription
    });

    logGraphQl.logSubscribing(subscriptions.subscribeSayHelloBackLetsPlay, {
      gameId
    });
    this.sayHelloBackLetsPlaySubscription = (API.graphql(
      graphqlOperation(subscriptions.subscribeSayHelloBackLetsPlay, { gameId })
    ) as SubscriptionObservable<
      SubscribeSayHelloBackLetsPlaySubscription
    >).subscribe({
      next: this.handleSayHelloBackLetsPlaySubscription
    });

    logGraphQl.logSubscribing(subscriptions.subscribeSayHelloBackWatchGame, {
      gameId
    });
    this.sayHelloBackWatchGameSubscription = (API.graphql(
      graphqlOperation(subscriptions.subscribeSayHelloBackWatchGame, { gameId })
    ) as SubscriptionObservable<
      SubscribeSayHelloBackWatchGameSubscription
    >).subscribe({
      next: this.handleSayHelloBackWatchGame
    });

    logGraphQl.logSubscribing(subscriptions.subscribeStartNewGame, { gameId });
    this.startNewGameSubscription = (API.graphql(
      graphqlOperation(subscriptions.subscribeStartNewGame, { gameId })
    ) as SubscriptionObservable<SubscribeStartNewGameSubscription>).subscribe({
      next: this.handleStartNewGameSubscription
    });

    // --- Send sayHello ---
    const vars = { gameId, name: playersName };
    logGraphQl.logMutation(mutations.sayHello, vars);
    // Slightly delay it to give a subscriptions time to initialize
    setTimeout(
      () => API.graphql(graphqlOperation(mutations.sayHello, vars)),
      100
    );
  }

  private handleSayHelloSubscription = (
    res: SubscriptionHandleArg<SubscribeSayHelloSubscription>
  ) => {
    logGraphQl.logReceivingSubscriptionEvent(res);

    const gameId = this.gameId;
    const {
      state,
      playerXName,
      playerOName,
      turn,
      startingPlayer,
      gameBoard,
      playersName,
      player
    } = this.store.getState();

    if (state === States.WAITING_TO_JOIN) {
      // Unsubscribe to events that would result in a bad state
      this.sayHelloBackLetsPlaySubscription?.unsubscribe();
      this.sayHelloBackWatchGameSubscription?.unsubscribe();

      this.subscribeToTakeTurnEvents();

      const vars = {
        gameId,
        playerXName: playersName
      };
      logGraphQl.logMutation(mutations.sayHelloBackLetsPlay, vars);
      API.graphql(graphqlOperation(mutations.sayHelloBackLetsPlay, vars));
      this.store.dispatch(
        createJoinGameAsPlayerXAction(
          res.value.data!.subscribeSayHello!.name as string
        )
      );
    } else if (player === Player.X) {
      const vars = {
        gameId,
        playerXName,
        playerOName,
        turn,
        startingPlayer,
        gameBoard
      };
      logGraphQl.logMutation(mutations.sayHelloBackWatchGame, vars);
      API.graphql(graphqlOperation(mutations.sayHelloBackWatchGame, vars));
    }
  };

  private handleSayHelloBackLetsPlaySubscription = (
    res: SubscriptionHandleArg<SubscribeSayHelloBackLetsPlaySubscription>
  ) => {
    logGraphQl.logReceivingSubscriptionEvent(res);

    // Unsubscribe to events that would result in a bad state
    this.sayHelloBackLetsPlaySubscription?.unsubscribe();
    this.sayHelloBackWatchGameSubscription?.unsubscribe();
    this.sayHelloSubscription?.unsubscribe();

    this.subscribeToTakeTurnEvents();

    const playerXName = res.value.data!.subscribeSayHelloBackLetsPlay!
      .playerXName as string;
    this.store.dispatch(createJoinGameAsPlayerOAction(playerXName));
  };

  private handleSayHelloBackWatchGame = (
    res: SubscriptionHandleArg<SubscribeSayHelloBackWatchGameSubscription>
  ) => {
    logGraphQl.logReceivingSubscriptionEvent(res);

    // Unsubscribe to events that would result in a bad state
    this.sayHelloBackLetsPlaySubscription?.unsubscribe();
    this.sayHelloBackWatchGameSubscription?.unsubscribe();
    this.sayHelloSubscription?.unsubscribe();

    this.subscribeToTakeTurnEvents();

    const {
      playerXName,
      playerOName,
      startingPlayer,
      gameBoard,
      turn
    } = res.value.data!.subscribeSayHelloBackWatchGame!;
    this.store.dispatch(
      createWatchGameAsObserverAction(
        playerXName as string,
        playerOName as string,
        startingPlayer as Player,
        gameBoard as GameBoard,
        turn as number
      )
    );
  };

  private handleStartNewGameSubscription = (
    res: SubscriptionHandleArg<SubscribeStartNewGameSubscription>
  ) => {
    logGraphQl.logReceivingSubscriptionEvent(res);

    const { state } = this.store.getState();

    if (state === States.GAME_END) {
      this.store.dispatch(createStartNewGameAction());
    }
  };

  private subscribeToTakeTurnEvents() {
    if (
      this.takeTurnSubscription !== null &&
      this.takeTurnSubscription.closed === false
    ) {
      // Already subscribed
      console.error("Trying to subscribe to takeTurn after already subscribed");
      return;
    }

    logGraphQl.logSubscribing(subscriptions.subscribeTakeTurn, {
      gameId: this.gameId
    });
    this.takeTurnSubscription = (API.graphql(
      graphqlOperation(subscriptions.subscribeTakeTurn, { gameId: this.gameId })
    ) as SubscriptionObservable<SubscribeTakeTurnSubscription>).subscribe({
      next: res => {
        logGraphQl.logReceivingSubscriptionEvent(res);

        const { gameBoard: curGameBoard } = this.store.getState();
        const gameBoard = res.value.data!.subscribeTakeTurn!
          .gameBoard as GameBoard;

        // Prevent processing the same turn twice by comparing the hash of game board
        // If we don't do this, the player gets there turn proceed twice. The first time
        // when selecting a cell and the second when receiving in the subscription.
        if (hashGameBoard(curGameBoard) !== hashGameBoard(gameBoard)) {
          this.store.dispatch(
            createTakeTurnAction(
              res.value.data!.subscribeTakeTurn!.gameBoard as GameBoard
            )
          );
        }
      }
    });
  }

  public componentWillUnmount() {
    // Clean-up subscriptions
    this.sayHelloSubscription?.unsubscribe();
    this.sayHelloBackLetsPlaySubscription?.unsubscribe();
    this.sayHelloBackWatchGameSubscription?.unsubscribe();
    this.takeTurnSubscription?.unsubscribe();
    this.startNewGameSubscription?.unsubscribe();

    this.unsubscribeFromStore && this.unsubscribeFromStore();
  }

  private onSelectedCell = (cellPosition: CellPosition) => {
    const { player, turn, startingPlayer, gameBoard } = this.store.getState();

    if (player === null) {
      // We are an observer to the game
      return;
    }

    if (
      (turn % 2 === 0 && startingPlayer !== player) ||
      (turn % 2 === 1 && startingPlayer === player)
    ) {
      // It is the other player's turn
      return;
    }

    const newGameBoard = selectCell(player, cellPosition, gameBoard);
    this.store.dispatch(createTakeTurnAction(newGameBoard));
    const vars = {
      gameId: this.gameId,
      gameBoard: newGameBoard
    };
    logGraphQl.logMutation(mutations.takeTurn, vars);
    API.graphql(graphqlOperation(mutations.takeTurn, vars));
  };

  private startNewGame = () => {
    const { playerXName, playerOName, startingPlayer } = this.store.getState();

    this.store.dispatch(createStartNewGameAction());
    const vars = {
      gameId: this.gameId,
      playerXName,
      playerOName,
      startingPlayer
    };
    logGraphQl.logMutation(mutations.takeTurn, vars);
    API.graphql(graphqlOperation(mutations.startNewGame, vars));
  };

  private getShareUrl() {
    let url = window.location.toString();
    if (window.location.hash) {
      url = url.replace(window.location.hash, "");
    }
    if (window.location.search) {
      url = url.replace(window.location.search, "");
    }
    return url;
  }

  public render() {
    const {
      state,
      playerXName,
      playerOName,
      player,
      turn,
      startingPlayer,
      gameBoard
    } = this.store.getState();

    // --- Pregame states ---
    if (state === States.INITIAL) {
      return <div>Loading</div>;
    }

    if (state === States.WAITING_FOR_NAME) {
      return (
        <div className={styles.GamePage}>
          <Background
            background={BackgroundOptions.DEFAULT}
            logo={LogoOptions.DEFAULT}
          />
          <NamePrompt onNameValue={this.onNameSet} />
          <ShareUrl url={this.getShareUrl()} />
        </div>
      );
    }

    if (state === States.WAITING_TO_JOIN) {
      return (
        <div className={styles.GamePage}>
          <Background
            background={BackgroundOptions.LOADING}
            logo={LogoOptions.DEFAULT}
          />
          <WaitingForPlayerToJoin />
          <ShareUrl url={this.getShareUrl()} />
        </div>
      );
    }

    // --- In/Post-game states ---
    const currentPlayersTurn =
      turn % 2 === 0
        ? startingPlayer
        : startingPlayer === Player.X
        ? Player.O
        : Player.X;

    const wins = findWins(gameBoard);

    if (state === States.TURN) {
      return (
        <div className={styles.GamePage}>
          <Background
            background={BackgroundOptions.DEFAULT}
            logo={LogoOptions.DEFAULT}
          />
          <div className={styles.status}>
          <CurrentPlayerStatus
            playerXName={playerXName}
            playerOName={playerOName}
            viewersPlayer={player}
            currentPlayersTurn={currentPlayersTurn}
          />
          </div>
          <div className={styles.board}>
            <Board
              onSelected={this.onSelectedCell}
              board={gameBoard}
              player={currentPlayersTurn}
              isSelectable={currentPlayersTurn === player}
              wins={wins}
            />
          </div>
        </div>
      );
    }

    if (state === States.GAME_END) {
      return (
        <div className={styles.GamePage}>
          <Background
            background={BackgroundOptions.WINNER}
            logo={LogoOptions.DEFAULT}
          />
          <div className={styles.status}>
            <WinnerStatus
              playerXName={playerXName}
              playerOName={playerOName}
              viewersPlayer={player}
              currentPlayersTurn={currentPlayersTurn}
              isWin={wins.length > 0}
            />
          </div>
          <div className={styles.board}>
            <Board
              onSelected={() => {}}
              board={gameBoard}
              player={currentPlayersTurn}
              isSelectable={false}
              wins={wins}
            />
            {player !== null && <PlayAgainButton className={styles.playAgain} callback={this.startNewGame} />}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.GamePage}>
        <Background
          background={BackgroundOptions.ERROR}
          logo={LogoOptions.DEFAULT}
        />
        <Error message={`Currently unsupported game state [${state}]`} />
      </div>
    );
  }
}
