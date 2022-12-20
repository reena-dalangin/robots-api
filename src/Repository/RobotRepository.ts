import { AppDataSource } from '../data-source';
import { Robot } from "../Entity/Robot";

export class RobotRepository{
  private robotRepository = AppDataSource.getRepository(Robot);

  async getAll(queryString: object) {
    return this.robotRepository.find({ where: queryString });
  }

  async getOne(robotId: number) {
    return await this.robotRepository.findOne({
      where: { id: robotId }
    });
  }

  async insert(robot: Robot) {
    return this.robotRepository.save(robot);
  }

  async update(robot: Robot, robotId: number) {
    return this.robotRepository.update(robotId, robot);
  }

  async updatePurpose(id: number, purpose: string) {
    return this.robotRepository.update(id, { purpose });
  }

  async delete(robotId: number) {
    return this.robotRepository.delete(robotId);
  }
}
