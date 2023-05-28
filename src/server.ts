import "reflect-metadata";
import { container } from "tsyringe";
import express from "express";
import { json } from "body-parser";
import { AddressInfo } from "net";
import dotenv from "dotenv";
import MovieController from "./controllers/movieController";

var app = express();

dotenv.config();

app.use(json());

const movieController = container.resolve(MovieController);

app.use("/movies", movieController.routes());

var server = app.listen(process.env.PORT ?? "65341", () => {
  let addressInfo = server.address() as AddressInfo;
  let address =
    addressInfo.address === "::" ? "localhost" : addressInfo.address;
  let port = addressInfo.port;

  console.log("Movies API listening at http://%s:%s", address, port);
});
