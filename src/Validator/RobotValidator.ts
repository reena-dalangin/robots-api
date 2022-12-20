import * as HttpStatus from 'http-status';

export class RobotValidator{
  check(robotPayload) {
    const requiredFields = ['name', 'purpose'];

    if (Object.keys(robotPayload).length === 0 || Object.keys(robotPayload).length < Object.keys(requiredFields).length) {
      throw {
        message: "Invalid parameters",
        status: HttpStatus.UNPROCESSABLE_ENTITY
      };
    }

    if (Object.keys(robotPayload)) {
      const missingParameters = Object.keys(robotPayload).filter(attribute => !requiredFields.includes(attribute));

      if (Object.keys(missingParameters).length !== 0) {
        throw {
          message: "Invalid parameters",
          status: HttpStatus.UNPROCESSABLE_ENTITY
        };
      }
    }

    return robotPayload;
  }
}
