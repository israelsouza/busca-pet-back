import express from "express";
import type { Express, Router, Request, Response } from "express";

class App {
  app: Express;
  router: Router;
  PORT: Number;

  constructor(app: Express, PORT: 3000, router: Router) {
    this.router = router;
    this.app = app;
    this.PORT = PORT;
    console.log("App initialized");
    this.configs();
    this.hello();
    this.start();
  }

  configs() {
    this.app.use(express.json());
    this.app.use(this.router);
  }

  start() {
    this.app.listen(this.getPort(), (): void => {
      console.log(`App listen in: http://localhost:${this.getPort()}`);
    });
  }

  hello() {
    this.router.get("/", (_: Request, res: Response) => {
      return res.status(200).json({ message: "Hello, friends!!" });
    });
  }

  mockUsers() {
    this.router.get("/users", (_: Request, res: Response) => {
      return res.status(200).json({
        message: "This people is amazing!!",
        data: {
          users: ["augusto galego", "lucas montano"],
        },
      });
    });
  }

  getPort() {
    return this.PORT;
  }
}

export default App;
