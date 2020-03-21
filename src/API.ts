/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type SayHelloMutationVariables = {
  gameId: string,
  name: string,
};

export type SayHelloMutation = {
  sayHello:  {
    __typename: "SayHello",
    gameId: string | null,
    name: string | null,
  } | null,
};

export type SayHelloBackLetsPlayMutationVariables = {
  gameId: string,
  playerXName: string,
};

export type SayHelloBackLetsPlayMutation = {
  sayHelloBackLetsPlay:  {
    __typename: "SayHelloBackLetsPlay",
    gameId: string | null,
    playerXName: string | null,
  } | null,
};

export type SayHelloBackWatchGameMutationVariables = {
  gameId: string,
  playerXName: string,
  playerOName: string,
  turn: number,
  startingPlayer: string,
  gameBoard: Array< string | null >,
};

export type SayHelloBackWatchGameMutation = {
  sayHelloBackWatchGame:  {
    __typename: "SayHelloBackWatchGame",
    gameId: string | null,
    playerXName: string | null,
    playerOName: string | null,
    turn: number | null,
    startingPlayer: string | null,
    gameBoard: Array< string | null > | null,
  } | null,
};

export type TakeTurnMutationVariables = {
  gameId: string,
  gameBoard: Array< string | null >,
};

export type TakeTurnMutation = {
  takeTurn:  {
    __typename: "TakeTurn",
    gameId: string | null,
    gameBoard: Array< string | null > | null,
  } | null,
};

export type StartNewGameMutationVariables = {
  gameId: string,
  playerXName: string,
  playerOName: string,
  startingPlayer: string,
};

export type StartNewGameMutation = {
  startNewGame:  {
    __typename: "StartNewGame",
    gameId: string | null,
    playerXName: string | null,
    playerOName: string | null,
    startingPlayer: string | null,
  } | null,
};

export type NoopQuery = {
  noop:  {
    __typename: "SayHello",
    gameId: string | null,
    name: string | null,
  } | null,
};

export type SubscribeSayHelloSubscriptionVariables = {
  gameId: string,
};

export type SubscribeSayHelloSubscription = {
  subscribeSayHello:  {
    __typename: "SayHello",
    gameId: string | null,
    name: string | null,
  } | null,
};

export type SubscribeSayHelloBackLetsPlaySubscriptionVariables = {
  gameId: string,
};

export type SubscribeSayHelloBackLetsPlaySubscription = {
  subscribeSayHelloBackLetsPlay:  {
    __typename: "SayHelloBackLetsPlay",
    gameId: string | null,
    playerXName: string | null,
  } | null,
};

export type SubscribeSayHelloBackWatchGameSubscriptionVariables = {
  gameId: string,
};

export type SubscribeSayHelloBackWatchGameSubscription = {
  subscribeSayHelloBackWatchGame:  {
    __typename: "SayHelloBackWatchGame",
    gameId: string | null,
    playerXName: string | null,
    playerOName: string | null,
    turn: number | null,
    startingPlayer: string | null,
    gameBoard: Array< string | null > | null,
  } | null,
};

export type SubscribeTakeTurnSubscriptionVariables = {
  gameId: string,
};

export type SubscribeTakeTurnSubscription = {
  subscribeTakeTurn:  {
    __typename: "TakeTurn",
    gameId: string | null,
    gameBoard: Array< string | null > | null,
  } | null,
};

export type SubscribeStartNewGameSubscriptionVariables = {
  gameId: string,
};

export type SubscribeStartNewGameSubscription = {
  subscribeStartNewGame:  {
    __typename: "StartNewGame",
    gameId: string | null,
    playerXName: string | null,
    playerOName: string | null,
    startingPlayer: string | null,
  } | null,
};
