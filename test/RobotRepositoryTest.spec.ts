import { Robot } from "../src/Entity/Robot";
import { RobotRepository } from '../src/Repository/RobotRepository';
import { TestHelper } from '../src/Resolver/TestHelper';

describe('Robot Repository Test', () => {
  const dataSource = new TestHelper();
  const robotRepository = new RobotRepository();

  beforeAll(async () => {
    await dataSource.initialize();
    await dataSource.drop();
  });

  afterAll(async () => {
    await dataSource.close();
  });

  describe('List all Robots', () => {
    it('should return an object of robots when fetching all', async () => {
      await dataSource.insertRobot('reena', 'debugging');
      const robots = await robotRepository.getAll({});

      expect(Object.keys(robots).length).toBe(1);
      expect(typeof robots).toBe('object');
    });

    it('should return an empty object when robots dont exist', async () => {
      await dataSource.drop();
      const robots = await robotRepository.getAll({});

      expect(Object.keys(robots).length).toBe(0);
      expect(typeof robots).toBe('object');
    });
  });

  describe('List all Robots by Parameters', () => {
    it('should return an object of robots when fetching all by purpose', async () => {
      await dataSource.insertRobot('reena', 'coding');
      const robots = await robotRepository.getAll({purpose: 'coding'});

      expect(Object.keys(robots).length).toBe(1);
      expect(typeof robots).toBe('object');
    });

    it('should return an empty object when fetching all robots by parameter but dont exist', async () => {
      const robots = await robotRepository.getAll({purpose: 'trading'});

      expect(Object.keys(robots).length).toBe(0);
      expect(typeof robots).toBe('object');
    });
  });

  describe('View Robot by Id', () => {
    it('should return a Robot object when fetching by id', async () => {
      const robots = await robotRepository.getAll({});

      const result = await robotRepository.getOne(robots[0].id);

      expect(result).toHaveProperty('name', robots[0].name);
      expect(result).toHaveProperty('purpose', robots[0].purpose);
      expect(result).toHaveProperty('id', robots[0].id);
      expect(result).toHaveProperty('created_at', robots[0].created_at);
      expect(result).toHaveProperty('updated_at', robots[0].updated_at);
      expect(typeof result).toBe('object');
    });

    it('should return an empty object when fetching robot by non-existing id', async () => {
      const robot = await robotRepository.getOne(100);

      expect(robot).toBeNull();
      expect(typeof robot).toBe('object');
    });
  });

  describe('Delete Robot by Id', () => {
    it('should return an object when deleting robot by id', async () => {
      let robotId = await dataSource.getOneRobot();
 
      const result = await robotRepository.delete(robotId);

      expect(result.affected).toBe(1);
      expect(typeof result).toBe('object');
    });

    it('should return an empty object when deleting non-existing robot', async () => {
      const robot = await robotRepository.delete(1000);

      expect(robot.affected).toBe(0);
      expect(typeof robot).toBe('object');
    });
  });

  describe('Insert New Robot', () => {
    it('should return an object when adding new robot', async () => {
      const newRobot = Object.assign(new Robot(),{
        name: 'Reena',
        purpose: 'Prototyping'
      });

      const robot = await robotRepository.insert(newRobot);

      expect(typeof robot).toBe('object');
      expect(robot).toHaveProperty('id');
      expect(robot).toHaveProperty('name', newRobot.name);
      expect(robot).toHaveProperty('purpose', newRobot.purpose);
      expect(robot).toHaveProperty('created_at');
      expect(robot).toHaveProperty('updated_at');
    });
  });

  describe('Update Robot Purpose by Id', () => {
    it('should return an object when updating robots purpose', async () => {
      let robotId = await dataSource.getOneRobot();
 
      const updatedRobot = await robotRepository.updatePurpose(robotId, 'travel');

      expect(typeof updatedRobot).toBe('object');
      expect(updatedRobot.affected).toBe(1);
    });

    it('should return an object when updating purpose of non-existing robot', async () => {
      const updatedRobot = await robotRepository.updatePurpose(1000, 'coding');

      expect(typeof updatedRobot).toBe('object');
      expect(updatedRobot.affected).toBe(0);
    });
  });

  describe('Update Robot by Id', () => {
    it('should return an object when updating robot by Id', async () => {
      let robotId = await dataSource.getOneRobot();

      const robot = await robotRepository.getOne(robotId);

      const updatedPayload = Object.assign(new Robot(),{
        name: 'Reena',
        purpose: 'writing'
      });
 
      const result = await robotRepository.update(updatedPayload, robotId);

      const updatedRobot = await robotRepository.getOne(robotId);

      expect(typeof result).toBe('object');
      expect(robot.purpose).not.toBe(updatedRobot.purpose);
      expect(result.affected).toBe(1);
    });

    it('should return an object when updating non-existing robot', async () => {
      const updatedPayload = Object.assign(new Robot(),{
        name: 'Marvin',
        purpose: 'prototyping'
      });

       const updatedRobot = await robotRepository.update(updatedPayload, 1000);

      expect(typeof updatedRobot).toBe('object');
      expect(updatedRobot.affected).toBe(0);
    });
  });
})
