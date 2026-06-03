import BaseSeeder from "../../common/base_classes/base-seeder.js";
import { hashPassword } from "../auth.util.js";
import Roles from "../../common/enums/user-roles.enum.js";

class AdminSeeder extends BaseSeeder {
  constructor() {
    super();
  }

  async seed(email, password) {
    const normalized = email.toLowerCase();

    const exists = await this.db.user.findUnique({
      where: { email: normalized },
      select: { id: true },
    });

    if (exists) {
      this.log.warn(`User with email ${normalized} already exists.`);
      process.exit(1);
    }

    const hashed = await hashPassword(password);

    const created = await this.db.user.create({
      data: {
        email: normalized,
        password: hashed,
        role: Roles.Admin,
      },
    });

    this.log.info(`Admin seeded: ${created.email}`);
  }
}

BaseSeeder.run(async function AdminSeed() {
  const seeder = new AdminSeeder();
  const [, , argEmail, argPassword] = process.argv;
  const email = argEmail; // kayaknya bisa pake env
  const password = argPassword;

  if (!email || !password) {
    seeder.log.warn("Usage: npm run seed:admin <email> <password>");
    process.exit(1);
  }

  await seeder.seed(email, password);
});

// Example :
// npm run seed:admin admin@gmail.com Admin123!