import { AppDataSource } from '../data-source';

export class TestHelper {
  async initialize() {
    await AppDataSource.initialize()
      .then(() => {
        //console.log("Data Source has been initialized!")
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
      });
  }

  async drop() {
    await AppDataSource.query(`TRUNCATE public.robot CASCADE`);
  }

  async insertRobot(robotName: string, robotPurpose: string) {
    return await AppDataSource.query(`INSERT INTO public.robot (name, purpose) VALUES ('${robotName}', '${robotPurpose}')`);
  }

  async getOneRobot() {
    await AppDataSource.query(`INSERT INTO public.robot (name, purpose) VALUES ('robot1', 'purpose1')`);

    const robots = await AppDataSource.query(`SELECT * FROM public.robot`);
    
    return robots[0].id;
  }

  async close() {
    await AppDataSource.destroy();
  }
}
