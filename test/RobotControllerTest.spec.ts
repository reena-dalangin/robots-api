import "reflect-metadata";
import { Request, Response } from 'express';
import { TestHelper } from '../src/Resolver/TestHelper';
import { RobotController } from '../src/Controller/RobotController';
import * as HttpStatus from 'http-status';

describe('Robot Controller Test', () => {
  const dataSource = new TestHelper();
  const robotController = new RobotController();
  let req = {} as Request;
  let res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeAll(async () => {
    await dataSource.initialize();
    await dataSource.drop();
    await dataSource.insertRobot('reena', 'debugging');
  });

  afterAll(async () => {
    await dataSource.close();
  });

  describe('create(): Insert New Robot', () => {
    it('should return a 201 - CREATED response on successful creation of new robot', async () => {
      req = Object.assign(req, { body: { name: 'Yern', purpose: 'AI' }});

      let result = await robotController.create(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.CREATED);        
      expect(result).toHaveProperty('body');        
      expect(result.body).toHaveProperty('data');   
    });

    it('should throw a 422 error - UNPROCESSABLE_ENTITY when creating robot with invalid payload', async () => {
      req = Object.assign(req, { body: { name: 'Yern', purpose: 'AI', invalid: "No"}});

      let result = await robotController.create(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.UNPROCESSABLE_ENTITY);        
      expect(result).toHaveProperty('body');        
    });

    it('should throw a 422 error - UNPROCESSABLE_ENTITY when creating robot with missing parameters', async () => {
      req = Object.assign(req, { body: { name: 'Yern'}});

      let result = await robotController.create(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.UNPROCESSABLE_ENTITY);        
      expect(result).toHaveProperty('body');        
    });

    it('should throw a 422 error - UNPROCESSABLE_ENTITY when creating robot with empty request payload', async () => {
      req = Object.assign(req, { body: {}});

      let result = await robotController.create(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.UNPROCESSABLE_ENTITY);        
      expect(result).toHaveProperty('body');        
    });
  });

  describe('findAll(): Fetch All Robots', () => {
    it('should return a 200 - OK response when fetching all robots', async () => {
      let robots = await robotController.findAll(req, res);

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('status', HttpStatus.OK);        
      expect(robots).toHaveProperty('body');        
      expect(robots.body).toHaveProperty('data');   
    });

    it('should return a 200 - OK response when fetching all robots but dont exist', async () => {
      let robots = await robotController.findAll(req, res);

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('status', HttpStatus.OK);        
      expect(robots).toHaveProperty('body');        
      expect(robots.body).toHaveProperty('data');   
    });
  });

  describe('findAll(): Fetch All Robots by Paramaters', () => {
    it('should return a 200 - OK response when fetching all robots by purpose', async () => {
      await dataSource.insertRobot('reena', 'writing');
      
      req = Object.assign(req, { query: { purpose: 'writing' }});

      let robots = await robotController.findAll(req, res);

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('status', HttpStatus.OK);        
      expect(robots).toHaveProperty('body');        
      expect(robots.body).toHaveProperty('data');  
    });

     it('should return a 200 - OK response when fetching all robots by purpose but dont exist', async () => {
      await dataSource.drop();

      req = Object.assign(req, { query: { purpose: 'writing' }});

      let robots = await robotController.findAll(req, res);

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('status', HttpStatus.OK);        
      expect(robots).toHaveProperty('body');        
      expect(robots.body).toHaveProperty('data');  
     });
  });

  describe('getOne(): View Robot by Id', () => {
    it('should return a 200 - OK response when fetching robot by id', async () => {
      let robotId = await dataSource.getOneRobot();

      let robot = await robotController.getOne(Object.assign(req, { params: { id: robotId }}), res);

      expect(typeof robot).toBe('object');
      expect(robot).toHaveProperty('status', HttpStatus.OK);        
      expect(robot).toHaveProperty('body');        
      expect(robot.body).toHaveProperty('data');  
    });

     it('should throw a 404 error - NOT_FOUND when fetching non-existing robot by id', async () => {
      let robot = await robotController.getOne(Object.assign(req, { params: { id: 100000 }}), res);

      expect(typeof robot).toBe('object');
      expect(robot).toHaveProperty('status', HttpStatus.NOT_FOUND);        
      expect(robot).toHaveProperty('body');
     });
  });

  describe('remove(): Delete Robot by Id', () => {
    it('should return a 204 - NO_CONTENT response when deleting robot by id', async () => {
      let robotId = await dataSource.getOneRobot();

      let result = await robotController.remove(Object.assign(req, { params: { id: robotId }}), res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.NO_CONTENT);        
    });

    it('should throw a 404 error - NOT_FOUND when deleting non-existing robot by id', async () => {
      let result = await robotController.remove(Object.assign(req, { params: { id: 100000 }}), res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.NOT_FOUND);        
      expect(result).toHaveProperty('body');
    });
  });

  describe('updatePurpose(): Update Robot Purpose by Id', () => {
    it('should return a 200 - OK response when updating robot purpose by id', async () => {
      let robotId = await dataSource.getOneRobot();

      req = Object.assign(req,
         { 
          params: {
             id: robotId 
          },
          body: {
            purpose: 'runner'
          }
        });

      let result = await robotController.updatePurpose(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.OK);        
      expect(result).toHaveProperty('body');
    });

    it('should throw a 404 error - NOT_FOUND when updating non-existing robot by id', async () => {
    req = Object.assign(req,
      { 
       params: {
          id: 100000 
       },
       body: {
         purpose: 'runner'
       }
     });

     let result = await robotController.updatePurpose(req, res);

     expect(typeof result).toBe('object');
     expect(result).toHaveProperty('status', HttpStatus.NOT_FOUND);        
     expect(result).toHaveProperty('body');
    });
  });

  describe('update(): Update Robot by Id', () => {
    it('should return a 200 - OK response when updating robot by id', async () => {
      let robotId = await dataSource.getOneRobot();

      req = Object.assign(req,
        { 
          params: {
            id: robotId 
          },
          body: {
            purpose: 'runner',
            name: 'Marvin'
          }
        });

      let result = await robotController.update(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.OK);        
      expect(result).toHaveProperty('body');
    });

    it('should throw a 404 error - NOT_FOUND when updating non-existing robot by id', async () => {
      req = Object.assign(req,
        { 
          params: {
            id: 10000 
          },
          body: {
            purpose: 'runner',
            name: 'Marvin'
          }
        });

      let result = await robotController.update(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.NOT_FOUND);        
      expect(result).toHaveProperty('body');
    });

    it('should throw a 422 error - UNPROCESSABLE_ENTITY when updating robot by id with invalid parameters', async () => {
      req = Object.assign(req,
        { 
          params: {
            id: 10000 
          },
          body: {
            purpose: 'runner',
            name: 'Marvin',
            invalid: 'invalid-parameter'
          }
        });

      let result = await robotController.update(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.UNPROCESSABLE_ENTITY);        
      expect(result).toHaveProperty('body');
    });

    it('should throw a 422 error - UNPROCESSABLE_ENTITY when updating robot by id with missing parameters', async () => {
      req = Object.assign(req,
        { 
          params: {
            id: 10000 
          },
          body: {
            purpose: 'runner'
          }
        });

      let result = await robotController.update(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.UNPROCESSABLE_ENTITY);        
      expect(result).toHaveProperty('body');
    });

    it('should throw a 422 error - UNPROCESSABLE_ENTITY when updating robot by id with empty parameters', async () => {
      req = Object.assign(req,
        { 
          params: {
            id: 10000 
          },
          body: {}
        });

      let result = await robotController.update(req, res);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('status', HttpStatus.UNPROCESSABLE_ENTITY);        
      expect(result).toHaveProperty('body');
    });
  });
})
