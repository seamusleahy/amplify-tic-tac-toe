// tslint:disable
// this is an auto generated file. This will be overwritten

export const subscribeSayHello = /* GraphQL */ `
  subscription SubscribeSayHello($gameId: String!) {
    subscribeSayHello(gameId: $gameId) {
      gameId
      name
    }
  }
`;
export const subscribeSayHelloBackLetsPlay = /* GraphQL */ `
  subscription SubscribeSayHelloBackLetsPlay($gameId: String!) {
    subscribeSayHelloBackLetsPlay(gameId: $gameId) {
      gameId
      playerXName
    }
  }
`;
export const subscribeSayHelloBackWatchGame = /* GraphQL */ `
  subscription SubscribeSayHelloBackWatchGame($gameId: String!) {
    subscribeSayHelloBackWatchGame(gameId: $gameId) {
      gameId
      playerXName
      playerOName
      turn
      startingPlayer
      gameBoard
    }
  }
`;
export const subscribeTakeTurn = /* GraphQL */ `
  subscription SubscribeTakeTurn($gameId: String!) {
    subscribeTakeTurn(gameId: $gameId) {
      gameId
      gameBoard
    }
  }
`;
export const subscribeStartNewGame = /* GraphQL */ `
  subscription SubscribeStartNewGame($gameId: String!) {
    subscribeStartNewGame(gameId: $gameId) {
      gameId
      playerXName
      playerOName
      startingPlayer
    }
  }
`;
