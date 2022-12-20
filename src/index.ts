import * as express from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import { Request, Response } from "express";
import { Routes } from "./routes";

AppDataSource.initialize().then(async () => {
  const app = express();

  app.use(bodyParser.json());

  Routes.forEach(async (route) => {
    (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
      const data =  await (new (route.controller as any))[route.action](req, res, next);
      res.status(data.status).send(data.body);
    })
  });

  app.listen(3000, () => {
    console.log("Express server has started on port 3000");
  });

}).catch(error => console.log(error))
