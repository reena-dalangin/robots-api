import { RobotController } from "./Controller/RobotController";

export const Routes = [{
  method: "get",
  route: "/robots",
  controller: RobotController,
  action: "findAll"
}, {
  method: "get",
  route: "/robots/:id",
  controller: RobotController,
  action: "getOne"
}, {
  method: "post",
  route: "/robots",
  controller: RobotController,
  action: "create"
}, {
  method: "delete",
  route: "/robots/:id",
  controller: RobotController,
  action: "remove"
}, {
  method: "patch",
  route: "/robots/:id",
  controller: RobotController,
  action: "updatePurpose"
}, {
  method: "put",
  route: "/robots/:id",
  controller: RobotController,
  action: "update"
}];
