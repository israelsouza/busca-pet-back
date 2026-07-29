import { Handler } from 'aws-lambda';
import express, { Express } from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { bootstrapLambda } from './app/bootstrap';

let cachedHandler: Handler;

export const handler: Handler = async (event, context, callback) => {
  if (!cachedHandler) {
    const expressApp: Express = express();
    const nestApp = await bootstrapLambda(expressApp);
    await nestApp.init();
    cachedHandler = serverlessExpress({ app: expressApp });
  }
  return cachedHandler(event, context, callback) as Promise<unknown>;
};
