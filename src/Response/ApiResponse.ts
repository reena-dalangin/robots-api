import * as HttpStatus from 'http-status';
import { Request, Response } from "express";

export class ApiResponse {
  async success(request: Request, response: Response, data: any) {
    return {
      status: HttpStatus.OK,
      body: data
    };
  }

  async created(request: Request, response: Response, data: object) {
    return {
      status: HttpStatus.CREATED,
      body: data
    };
  }
  async noContent(response: Response) {
    return {
      status: HttpStatus.NO_CONTENT
    };
  }

  async error(response: Response, data) {
    return {
      status: data.status,
      body: {
        "status": data.status,
        "code": HttpStatus[`${data.status}_NAME`],
        "error": {
          "title": HttpStatus[data.status],
          "detail": data.message
        }
      }
    };
  }
}
