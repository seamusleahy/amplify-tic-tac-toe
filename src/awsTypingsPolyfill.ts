import * as Observable from "zen-observable";
import { GraphQLResult } from "@aws-amplify/api/lib-esm/types";

export interface AwsSubscriberValue<T> {
  provider: {};
  value: T;
}

export interface Subscription {
  closed: boolean;
  unsubscribe(): void;
}

export type SubscriptionHandleArg<SUB> = AwsSubscriberValue<GraphQLResult<SUB>>;
export type SubscriptionObservable<SUB> = Observable<SubscriptionHandleArg<SUB>>;