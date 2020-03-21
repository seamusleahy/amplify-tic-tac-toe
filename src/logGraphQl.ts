export type LogVariables = {
  [key: string]: any;
};

export type SubscriptionResponse = {
  value: {
    data?: {
      [key: string]: {
        [key: string]: any;
      } | null;
    };
  };
};

export type GraphQlStatement = string;

export enum LogTypes {
  MUTATION = "Mutation",
  SUBSCRIBING = "Subscribing",
  SUBSCRIPTION_EVENT = "Subscription Event"
}

type MutationLog = {
  type: LogTypes.MUTATION;
  time: Date;
  stack: string;
  name: string;
  query: GraphQlStatement;
  variables: LogVariables;
  comment?: string;
};

type SubscribingLog = {
  type: LogTypes.SUBSCRIBING;
  time: Date;
  stack: string;
  name: string;
  query: GraphQlStatement;
  variables: LogVariables;
  comment?: string;
};

type SubscriptionEventLog = {
  type: LogTypes.SUBSCRIPTION_EVENT;
  time: Date;
  stack: string;
  name: string;
  variables: LogVariables | null;
  comment?: string;
};

export type Log = MutationLog | SubscribingLog | SubscriptionEventLog;

const logs: Log[] = [];

export type SubscriberCallback = (log: Log) => void;

const subscribeCallbacks: SubscriberCallback[] = [];

export function subscribe(callback: SubscriberCallback) {
  subscribeCallbacks.push(callback);
}

function getStack() {
  const err = new Error();
  if (!err.stack) {
    return '';
  }
  const stack = err.stack.split('\n');
  stack.splice(0, 2);
  return stack.join('\n');
}

function addLog(log: Log) {
  logs.push(log);
  subscribeCallbacks.forEach(cb => cb(log));
}

export function logMutation(
  graphQlStatement: GraphQlStatement,
  variables: LogVariables,
  comment?: string
) {
  const matches = graphQlStatement.match(/^\s*mutation\s+(\w+)/);

  if (matches === null) {
    throw new Error("Not a valid GraphQL mutation");
  }

  const name = matches[1];

  const log: MutationLog = {
    type: LogTypes.MUTATION,
    time: new Date(),
    stack: getStack(),
    name,
    query: graphQlStatement,
    variables,
    comment
  };
  addLog(log);
}

export function logSubscribing(
  graphQlStatement: GraphQlStatement,
  variables: LogVariables,
  comment?: string
) {
  const matches = graphQlStatement.match(/^\s*subscription\s+(\w+)/);

  if (matches === null) {
    throw new Error("Not a valid GraphQL subscription");
  }

  const name = matches[1];

  const log: SubscribingLog = {
    type: LogTypes.SUBSCRIBING,
    time: new Date(),
    stack: getStack(),
    name,
    query: graphQlStatement,
    variables,
    comment
  };
  addLog(log);
}

export function logReceivingSubscriptionEvent(
  subscriptionResponse: SubscriptionResponse,
  comment?: string
) {
  const data = subscriptionResponse.value.data;

  if (!data) {
    return;
  }

  for (let name in data) {
    const log: SubscriptionEventLog = {
      type: LogTypes.SUBSCRIPTION_EVENT,
      time: new Date(),
      stack: getStack(),
      name,
      variables: data[name],
      comment
    };
    addLog(log);
  }
}

export function getLogs() {
  return logs;
}

export function consoleLogger(log: Log) {
  switch (log.type) {
    case LogTypes.MUTATION:
      console.group(`⬆️ GraphQL mutation: ${log.name}`)
      log.comment && console.log(log.comment);
      console.log('Query:', log.query);
      console.log('variables:', log.variables);
      console.groupEnd();
      break;

    case LogTypes.SUBSCRIBING:
      console.group(`👂GraphQL subscribe: ${log.name}`)
      log.comment && console.log(log.comment);
      console.log('Query:', log.query);
      console.log('variables:', log.variables);
      console.groupEnd();
      break;

    case LogTypes.SUBSCRIPTION_EVENT:
      console.group(`⬇️ GraphQL receive subscription: ${log.name}`)
      log.comment && console.log(log.comment);
      console.log('data:', log.variables);
      console.groupEnd();
      break;
  }
}
