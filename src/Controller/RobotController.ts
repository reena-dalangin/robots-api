import { ApiResponse } from "../Response/ApiResponse";
import { Request, Response } from "express";
import { RobotService } from '../Service/RobotService';
import { RobotValidator } from '../Validator/RobotValidator'; 

export class RobotController {
  private ApiResponse = new ApiResponse();
  private RobotService = new RobotService();
  private RobotValidator = new RobotValidator();

  async findAll(request: Request, response: Response) {
    try {
      const { query } = request;

      const robots =  await this.RobotService.getAll(query);

      return this.ApiResponse.success(request, response, robots);
    } catch (error) {
      return this.ApiResponse.error(response, error);
    }
  }

  async getOne(request: Request, response: Response) {
    try {
      const robot = await this.RobotService.getOne(parseInt(request.params.id));
      return this.ApiResponse.success(request, response, robot);
    } catch (error) {
      return this.ApiResponse.error(response, error);
    }
  }

  async create(request: Request, response: Response) {
    try {
      const robotPayload = this.RobotValidator.check(request.body);

      const robot = await this.RobotService.create(robotPayload);

      return this.ApiResponse.created(request, response, robot);
    } catch (error) {
      return this.ApiResponse.error(response, error);
    }
  }

  async update(request: Request, response: Response) {
    try {
      const robotPayload = this.RobotValidator.check(request.body);

      const robot = await this.RobotService.update(robotPayload, parseInt(request.params.id));

      return this.ApiResponse.success(request, response, 'Robot updated successfully.');
    } catch (error) {
      return this.ApiResponse.error(response, error);
    }
  }

  async updatePurpose(request: Request, response: Response) {
    try {
      const { purpose } = request.body;

      const robot = await this.RobotService.updatePurpose(parseInt(request.params.id), purpose);

      return this.ApiResponse.success(request, response, 'Robot updated successfully.');
    } catch (error) {
      return this.ApiResponse.error(response, error);
    }
  }

  async remove(request: Request, response: Response) {
    try {
      const robot = await this.RobotService.delete(parseInt(request.params.id));
      return this.ApiResponse.noContent(response);      
    } catch (error) {
      return this.ApiResponse.error(response, error);
    }
  }
}
