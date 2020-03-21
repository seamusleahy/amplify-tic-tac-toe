// tslint:disable
// this is an auto generated file. This will be overwritten

export const sayHello = /* GraphQL */ `
  mutation SayHello($gameId: String!, $name: String!) {
    sayHello(gameId: $gameId, name: $name) {
      gameId
      name
    }
  }
`;
export const sayHelloBackLetsPlay = /* GraphQL */ `
  mutation SayHelloBackLetsPlay($gameId: String!, $playerXName: String!) {
    sayHelloBackLetsPlay(gameId: $gameId, playerXName: $playerXName) {
      gameId
      playerXName
    }
  }
`;
export const sayHelloBackWatchGame = /* GraphQL */ `
  mutation SayHelloBackWatchGame(
    $gameId: String!
    $playerXName: String!
    $playerOName: String!
    $turn: Int!
    $startingPlayer: String!
    $gameBoard: [String]!
  ) {
    sayHelloBackWatchGame(
      gameId: $gameId
      playerXName: $playerXName
      playerOName: $playerOName
      turn: $turn
      startingPlayer: $startingPlayer
      gameBoard: $gameBoard
    ) {
      gameId
      playerXName
      playerOName
      turn
      startingPlayer
      gameBoard
    }
  }
`;
export const takeTurn = /* GraphQL */ `
  mutation TakeTurn($gameId: String!, $gameBoard: [String]!) {
    takeTurn(gameId: $gameId, gameBoard: $gameBoard) {
      gameId
      gameBoard
    }
  }
`;
export const startNewGame = /* GraphQL */ `
  mutation StartNewGame(
    $gameId: String!
    $playerXName: String!
    $playerOName: String!
    $startingPlayer: String!
  ) {
    startNewGame(
      gameId: $gameId
      playerXName: $playerXName
      playerOName: $playerOName
      startingPlayer: $startingPlayer
    ) {
      gameId
      playerXName
      playerOName
      startingPlayer
    }
  }
`;
