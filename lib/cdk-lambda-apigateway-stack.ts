
// https://github.com/just4give/cdk-lambda-with-layers-apigateway/blob/master/lib/cdk-lambda-apigateway-stack.ts

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import {
  aws_lambda as lambda,
  aws_kms as kms,
  aws_lambda_nodejs as lambdanodejs,
  aws_apigateway as apigateway,
  aws_dynamodb as dynamodb,
  Duration,
  // aws-apigatewayv2-integrations as gwInt
} from "aws-cdk-lib";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
// import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';




export class CdkLambdaApigatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkLambdaApigatewayQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const getTodoLambda = new lambdanodejs.NodejsFunction(this, "getTodoLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(5),
      entry: "lambda/api-get-todo/index.js",
      handler: "handler",
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      },
      bundling: {
        nodeModules: [],
        externalModules: [],
      },
      layers: [],
    });
    const httpApi = new apigwv2.HttpApi(this, "todo-http-api", {
      description: "HTTP API For TODO application",
      corsPreflight: {
        allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key"],
        allowMethods: [
          apigwv2.CorsHttpMethod.OPTIONS,
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.PATCH,
          apigwv2.CorsHttpMethod.DELETE,
        ],
        allowCredentials: false,
        allowOrigins: ["*"],
      },
    });
    const toDoIntegration = new HttpLambdaIntegration('getTodoLambdaIntegration', getTodoLambda);

    httpApi.addRoutes({
      path: "/todo",
      methods: [apigwv2.HttpMethod.GET],
      integration: toDoIntegration
    });

    new cdk.CfnOutput(this, `httpapidomain`, {
      value: httpApi.apiEndpoint,
      description: "HTTP API domain",
    });
  }
}
