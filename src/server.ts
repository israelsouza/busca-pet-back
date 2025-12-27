import App from "./app";
import express from "express";

const PORT = 3000;
const app = express();

const server = new App(app, PORT, express.Router());

server.start();
server.hello();
server.mockUsers();
