import { Context } from 'aws-lambda';
import express, { Express } from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { bootstrapLambda } from './app/bootstrap';

type AsyncHandler = (event: unknown, context: Context) => Promise<unknown>;
let cachedHandler: AsyncHandler;

export const handler = async (event: unknown, context: Context): Promise<unknown> => {
  if (!cachedHandler) {
    const expressApp: Express = express();
    const nestApp = await bootstrapLambda(expressApp);
    await nestApp.init();
    cachedHandler = serverlessExpress({ app: expressApp }) as unknown as AsyncHandler;
  }
  return cachedHandler(event, context);
};
