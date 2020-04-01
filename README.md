# Amplify Tic-Tac-Toe Tech Exploration

A technical exploration of using [AWS' Amplify](https://aws-amplify.github.io/), [AppSync's GraphQL Subscriptions](https://aws-amplify.github.io/docs/sdk/android/api#subscribe-to-data) and [AppSync's local/none resolver](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-local-resolvers.html) for a tic-tac-toe game.

After my first few technical explorations of Amplify, I want to swerve off the happy-path of most tutorials. Tic-tac-toe is a simple game that has different problems to solve than a simple to-do application. I'll say this here, there are better tech stacks for a tic-tac-toe game. 

My plan:
* Use GraphQL's Mutations and Subscriptions as a PubSub communication model.
* Use AppSync's local/none resolvers to remove the need for any database or Lambda functions - it stays all inside AppSync. This makes it more in the PubSub model.
* Try to keep it all in code using the Amplify CLI.

### Summary what I learned
* How to [create Subscriptions](https://aws-amplify.github.io/docs/js/api).
* How to create an [AppSync local/none resolver](https://aws.amazon.com/premiumsupport/knowledge-center/appsync-notify-subscribers-real-time/) that returns the mutation parameters as fields in the subscriptions.
* How to write the resolvers in code within an Amplify project using AWS CloudFormation which I wrote up below.

### Take-aways
* Although Amplify attempts to simplify a lot of development, this is a use-case that requires understanding AppSync and using CloudFormation.
* There is a noticable delay between the mutation being sent and the subscription being received. This sometimes caused the game to get into bad states.


## How-to setup local resolvers and subscriptions
The following is an overview instead of a detailed step-by-step tutorial.

1. Create a GraphQL API resource [with the Amplify CLI](https://aws-amplify.github.io/docs/js/api#automated-configuration-with-cli).
    ```shell
    amplify add api
    ```
2. In the [GraphQL Schema](https://docs.aws.amazon.com/appsync/latest/devguide/graphql-overview.html), create matching mutations and [subscriptions](https://docs.aws.amazon.com/appsync/latest/devguide/real-time-data.html). The mutation needs the parameters to match the fields. The subscription parameters are the parameters you want to filter on from the mutation. In this case, we only want to receive messages for the same `gameId`.
    
    AppSync requires a Query type which is why there is a noop field for it.
    **[amplify/backend/api/tictactoe](https://github.com/seamusleahy/amplify-tic-tac-toe/amplify/backend/api/tictactoe/schema.graphql)**
    ```graphql
    type SayHello {
      gameId: String
      name: String
    }

    type Mutation {
      sayHello(gameId: String!, name: String!): SayHello
    }

    type Subscription {
      subscribeSayHello(gameId: String!): SayHello
      @aws_subscribe(mutations: ["sayHello"])
    }

    type Query {
      # Query is required by Amplify/AppSync
      noop: SayHello
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
    ```
    *If you make the `subscribeSayHello`'s `gameId` parameter optional (by removing the `!`) and not passing in a `gameId` when subscribing, you would get the `sayHello` events for all games.*

3. As it stands now, nothing will happen with this API after you [`push` it](https://aws-amplify.github.io/docs/js/api#automated-configuration-with-cli). Next you will return all the mutation parameters as the return fields.

    *The following can also be [done via the UI in the AWS Console](https://aws.amazon.com/premiumsupport/knowledge-center/appsync-notify-subscribers-real-time/).*

    Amplify lets you [provide additional CloudFormation files(https://github.com/aws-amplify/amplify-cli/issues/1002)] at [`/amplify/backend/api/<API_NAME>/stacks/CustomResources.json`](https://github.com/seamusleahy/amplify/backend/api/tictactoe/stacks/CustomResources.json).

    Add resources for the None/Local resolver and the request/response configurations for the mutations to the `"Resources"` section of `CustomResources.json`.

4. Add the None/Local resolver to `CustomResources.json`.
    * Give it a `Type` of [`AWS::AppSync::DataSource`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html).
    * Set `Properties > ApiId` to a reference to `AppSyncApiId` which Amplify has defined.
    * Set `Properties > Type` to `NONE`.

    ```json
    {
      "Resources": {
        "NoneDataSource": {
          "Type": "AWS::AppSync::DataSource",
          "Properties": {
            "ApiId": {
              "Ref": "AppSyncApiId"
            },
            "Description": "The local (none) resolver data source",
            "Name": "NoneDataSource",
            "Type": "NONE"
          }
        }
      }
    }
    ````
  5. Add the resolver for the `sayHello` mutation to `CustomResources.json`.

      * Give it a `Type` of [`AWS::AppSync::Resolver`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html).
      * Set `Properties > ApiId` to a reference to `AppSyncApiId` which Amplify has defined.
      * Set `Properties > DataSourceName` to the Name of NoneDataSource with the `GetAtt` function.
      * Set `Properties > TypeName` to `Mutation`. This can be `Query` or `Mutation`.
      * Set `Properties > FieldName` to the `sayHello`.
      * Set `Properties > RequestMappingTemplateS3Location` to the ["Resolver Mapping Template" file](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-overview.html) in the Velocity Template Language (VTL) format for the request. You'll create this file in the next step. *(You can also define it inline with `RequestMappingTemplate`)*
      Set `Properties > ResponseMappingTemplateS3Location` to the ["Resolver Mapping Template" file](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-overview.html) file for the response. You'll create this file in the next step. *(You can also define it inline with `ResponseMappingTemplate`)*

      ```json
      {
        "Resources": {
          "NoneDataSource": {/*...*/},
          "SayHelloResolver": {
          "Type": "AWS::AppSync::Resolver",
          "Properties": {
            "ApiId": {
              "Ref": "AppSyncApiId"
            },
            "DataSourceName": {
              "Fn::GetAtt": [
                "NoneDataSource",
                "Name"
              ]
            },
            "TypeName": "Mutation",
            "FieldName": "sayHello",
            "RequestMappingTemplateS3Location": {
              "Fn::Sub": [
                "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Mutation.sayHello.req.vtl",
                {
                  "S3DeploymentBucket": {
                    "Ref": "S3DeploymentBucket"
                  },
                  "S3DeploymentRootKey": {
                    "Ref": "S3DeploymentRootKey"
                  }
                }
              ]
            },
            "ResponseMappingTemplateS3Location": {
              "Fn::Sub": [
                "s3://${S3DeploymentBucket}/${S3DeploymentRootKey}/resolvers/Mutation.sayHello.res.vtl",
                {
                  "S3DeploymentBucket": {
                    "Ref": "S3DeploymentBucket"
                  },
                  "S3DeploymentRootKey": {
                    "Ref": "S3DeploymentRootKey"
                  }
                }
              ]
            }
          }
        }
      }
      ```
  6. Create the ["Resolver Mapping Template" files](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-overview.html) to return the parameters to the `sayHello` mutation as the fields.

      Amplify creates an empty folder `resolvers` inside the API you created where you can add custom resolver mapping templates.

      [**`amplify/backend/api/tictactoe/resolvers/Mutation.sayHello.req.vtl`**](https://github.com/seamusleahy/amplify/backend/api/tictactoe/resolvers/Mutation.sayHello.req.vtl)
      ```vtl
      {
          "version": "2017-02-28",
          "payload": $util.toJson($context.arguments)
      }
      ```

      The `payload` value will be passed from the request to the response by AppSync.

      [**`amplify/backend/api/tictactoe/resolvers/Mutation.sayHello.res.vtl`**](https://github.com/seamusleahy/amplify/backend/api/tictactoe/resolvers/Mutation.sayHello.res.vtl)
      ```vtl
      {
          $util.toJson($context.result)
      }
      ```
7. Finally, push the configurations to AWS with `amplify push api`. Now you can subscribe to the mutations to get the values passed in as parameters.

