import * as HttpStatus from 'http-status';
import { Robot } from "../src/Entity/Robot";
import { RobotService } from '../src/Service/RobotService';
import { TestHelper } from '../src/Resolver/TestHelper';

describe('Robot Repository Test', () => {
  const dataSource = new TestHelper();
  const robotService = new RobotService();

  beforeAll(async () => {
    await dataSource.initialize();
    await dataSource.drop();
    await dataSource.insertRobot('reena', 'debugging');
  });

  afterAll(async () => {
    await dataSource.close();
  });

  describe('Get All Robots', () => {
    it('should return an object of robots when fetching all', async () => {
      await dataSource.insertRobot('reena', 'baking');
      const robots = await robotService.getAll({});

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('data');
      expect(robots.data).toHaveProperty('attributes');
      expect(Object.keys(robots.data.attributes).length).toBe(2);
    });

    it('should return an empty object when robots dont exist', async () => {
    await dataSource.drop();
      const robots = await robotService.getAll({});

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('data');
      expect(robots.data).toHaveProperty('attributes');
      expect(Object.keys(robots.data.attributes).length).toBe(0);
    });
  });

  describe('List all Robots by Parameters', () => {
    it('should return an object of robots when fetching all by purpose', async () => {
      await dataSource.insertRobot('reena', 'coding');
      const robots = await robotService.getAll({purpose: 'coding'});

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('data');
      expect(robots.data).toHaveProperty('attributes');
      expect(Object.keys(robots.data.attributes).length).toBe(1);
    });

    it('should return an empty object when fetching all robots by parameter but dont exist', async () => {
      const robots = await robotService.getAll({purpose: 'non-existing'});

      expect(typeof robots).toBe('object');
      expect(robots).toHaveProperty('data');
      expect(robots.data).toHaveProperty('attributes');
      expect(Object.keys(robots.data.attributes).length).toBe(0);
    });
  });

  describe('View Robot by Id', () => {
    it('should return a Robot object when fetching by id', async () => {
      let robotId = await dataSource.getOneRobot();
      const result = await robotService.getOne(robotId);

      expect(typeof result).toBe('object');
      expect(result.data).toHaveProperty('attributes');
      expect(result.data.attributes).toHaveProperty('name');
      expect(result.data.attributes).toHaveProperty('purpose');
      expect(result.data.attributes).toHaveProperty('id');
      expect(result.data.attributes).toHaveProperty('created_at');
      expect(result.data.attributes).toHaveProperty('updated_at');
    });

    it('should throw an error when fetching robot by non-existing id', async () => {
      try {
        await robotService.getOne(1000);
      }
      catch (error) {
        expect(typeof error).toBe('object');
        expect(error).toHaveProperty('message', 'Robot not found');
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('Delete Robot by Id', () => {
    it('should return an object when deleting robot by id', async () => {
      let robotId = await dataSource.getOneRobot();
      const robot = await robotService.delete(robotId);

      expect(robot.affected).toBe(1);
      expect(typeof robot).toBe('object');
    });

    it('should throw an error when deleting non-existing robot', async () => {
      try {
        await robotService.delete(1000);
      }
      catch (error) {
        expect(typeof error).toBe('object');
        expect(error).toHaveProperty('message', 'Robot not found');
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('Insert New Robot', () => {
    it('should return an object when adding new robot', async () => {
      const robotPayload = {
        name: 'Reena',
        purpose: 'Prototyping'
      };

      const result = await robotService.create(robotPayload);

      expect(typeof result).toBe('object');
      expect(result.data).toHaveProperty('attributes');
      expect(result.data.attributes).toHaveProperty('name', robotPayload.name);
      expect(result.data.attributes).toHaveProperty('purpose', robotPayload.purpose);
      expect(result.data.attributes).toHaveProperty('id');
      expect(result.data.attributes).toHaveProperty('created_at');
      expect(result.data.attributes).toHaveProperty('updated_at');
    });
  });

  describe('Update Robot Purpose by Id', () => {
    it('should return an object when updating robots purpose', async () => {
      let robotId = await dataSource.getOneRobot();
      const updatedRobot = await robotService.updatePurpose(robotId, 'coding');

      expect(typeof updatedRobot).toBe('object');
      expect(updatedRobot.affected).toBe(1);
    });

    it('should return an error when updating purpose of non-existing robot', async () => {
      try {
        await robotService.updatePurpose(1000, 'coding');
      }
      catch (error) {
        expect(typeof error).toBe('object');
        expect(error).toHaveProperty('message', 'Robot not found');
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('Update Robot by Id', () => {
    it('should return an object when updating robot by Id', async () => {
      let robotId = await dataSource.getOneRobot();
      const robot = await robotService.getOne(robotId);

      const updatedPayload = Object.assign(new Robot(),{
        name: 'Reena',
        purpose: 'gardening'
      });
 
      const result = await robotService.update(updatedPayload, robotId);

      const updatedRobot = await robotService.getOne(robotId);

      expect(typeof updatedRobot).toBe('object');
      expect(updatedRobot.data).toHaveProperty('attributes');
      expect(updatedRobot.data.attributes).toHaveProperty('name', updatedPayload.name);
      expect(updatedRobot.data.attributes).toHaveProperty('purpose', updatedPayload.purpose);
      expect(updatedRobot.data.attributes).toHaveProperty('id', robotId);
      expect(updatedRobot.data.attributes).toHaveProperty('created_at');
      expect(updatedRobot.data.attributes).toHaveProperty('updated_at');
    });

    it('should return an object when updating non-existing robot', async () => {
      try {
        const updatedPayload = Object.assign(new Robot(),{
          name: 'Reena',
          purpose: 'prototyping'
        });
  
        await robotService.update(updatedPayload, 1000);
      }
      catch (error) {
        expect(typeof error).toBe('object');
        expect(error).toHaveProperty('message', 'Robot not found');
        expect(error).toHaveProperty('status', HttpStatus.NOT_FOUND);
      }
    });
  });
})
