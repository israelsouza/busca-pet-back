import { App } from "./app";
import e from "express";
import { UserRoutes } from "./modules/Users/UserRoutes";

const expressInstance = e();
const corsOptions = { origin: "*" };
const route_users = new UserRoutes();

const app: App = new App(expressInstance, corsOptions, route_users);

app.listen(3000);
