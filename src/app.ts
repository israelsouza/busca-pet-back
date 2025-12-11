import express, { Express, NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { UserRoutes } from "./modules/Users/UserRoutes";

export class App {
  public readonly express;
  public readonly cors;
  public route_users: UserRoutes;

  constructor(express: Express, cors: CorsOptions, route_users: UserRoutes) {
    this.express = express;
    this.cors = cors;
    this.route_users = route_users;

    this.middlewares();
    this.errorHandling();
    this.routes();
  }

  middlewares(): void {
    this.express.use(cors(this.cors));
    this.express.use(express.json());
  }

  errorHandling(): void {
    this.express.use((req: Request, res: Response) => {
      return res
        .status(404)
        .json({ sucssess: false, error: "Route not found" });
    });

    this.express.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (error: Error, req: Request, res: Response, _next: NextFunction) => {
        console.error(error.stack);
        return res
          .status(500)
          .json({ sucssess: false, error: "Internal Server Error" });
      }
    );
  }

  private routes(): void {
    this.express.use("/api/v1/users", this.route_users.routes);
  }

  listen(port: number): void {
    this.express.listen(port, () => {
      console.log(`App listening on  http://localhost:${port}`);
    });
  }
}
