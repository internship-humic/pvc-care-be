import fs from "fs";
import path from "path";
import BaseSeeder from "../../common/base_classes/base-seeder.js";

class PlantSeeder extends BaseSeeder {
  constructor() {
    super();
    this.csvPath = path.join(
      process.cwd(),
      "src",
      "utils",
      "seeders",
      "data",
      "plants.csv"
    );
  }

  async getPlantsFromCSV() {
    const data = fs.readFileSync(this.csvPath, "utf8");
    return data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  async seed() {
    let seeded = 0;
    const plants = await this.getPlantsFromCSV();

    for (const name of plants) {
      const existing = await this.db.plant.findFirst({
        where: { name },
        select: { id: true },
      });

      if (existing) {
        this.log.warn(`Plant "${name}" already exists. Skipping.`);
        continue;
      }

      await this.db.plant.create({
        data: { name },
      });

      this.log.info(`Seeded plant: ${name}`);
      seeded++;
    }

    this.log.info(`Plant seeding complete. Total seeded: ${seeded}`);
  }
}

BaseSeeder.run(async function PlantSeed() {
  const seeder = new PlantSeeder();
  await seeder.seed();
});
