import { Robot } from "../Entity/Robot";

export class RobotBuilder{
  build(robotPayload) {
    return Object.assign(new Robot(), {
      name: robotPayload.name,
      purpose: robotPayload.purpose
    });
  }
};
