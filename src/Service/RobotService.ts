import HttpStatus = require("http-status");
import { RobotBuilder } from "../Builder/RobotBuilder";
import { RobotRepository } from "../Repository/RobotRepository";
import { ServiceResponse } from "../Response/ServiceResponse";

export class RobotService{
  private RobotBuilder= new RobotBuilder();
  private RobotRepository = new RobotRepository();
  private ServiceResponse = new ServiceResponse();

  async getAll(queryString: object) {
    const robots = await this.RobotRepository.getAll(queryString);
    return this.ServiceResponse.transform(robots);
  }

  async getOne(robotId: number) {
    const robot = await _checkIfRobotExist(robotId);
    return this.ServiceResponse.transform(robot);
  }

  async create(requestPayload: object) {
    const robotPayload = this.RobotBuilder.build(requestPayload);
    const robot = await this.RobotRepository.insert(robotPayload);

    if (!robot) {
      throw {
        message: "Failed to add new robot.",
        status: HttpStatus.UNPROCESSABLE_ENTITY
      };
    }

    return this.ServiceResponse.transform(robot);
  }

  async update(updatedRobot: object, robotId: number) {
    await _checkIfRobotExist(robotId);

    const updatedRobotPayload = this.RobotBuilder.build(updatedRobot);

    return await this.RobotRepository.update(updatedRobotPayload, robotId);
  }

  async updatePurpose(robotId: number, robotPurpose: string) {
    await _checkIfRobotExist(robotId);
    return await this.RobotRepository.updatePurpose(robotId, robotPurpose);
  }

  async delete(robotId: number) {
    await _checkIfRobotExist(robotId);
    return await this.RobotRepository.delete(robotId);
  }
}

const _checkIfRobotExist = async (robotId: number) => {
  const robot = await (new RobotRepository).getOne(robotId);

  if (!robot) {
    throw {
      message: "Robot not found",
      status: HttpStatus.NOT_FOUND
    };
  }

  return robot;
};
