import BaseSeeder from "../../common/base_classes/base-seeder.js";

class PlantSeeder extends BaseSeeder {
  constructor() {
    super();
    this.plants = [
      "Apple",
      "Banana",
      "Orange",
      "Mango",
      "Rice",
      "Corn",
      "Cassava",
      "Potato",
      "Tomato",
      "Chili",
      "Cucumber",
      "Spinach",
      "Lettuce",
      "Coffee",
      "Tea",
      "Pineapple",
      "Papaya",
      "Avocado",
      "Strawberry",
      "Grapes",
    ];
  }

  async seed() {
    let seeded = 0;
    for (const name of this.plants) {
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