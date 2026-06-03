import BaseSeeder from "../../common/base_classes/base-seeder.js";
import { hashPassword } from "../auth.util.js";
import Roles from "../../common/enums/user-roles.enum.js";

class DoctorSeeder extends BaseSeeder {
  constructor() {
    super();
  }

  async seed(email, password, name) {
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
        role: Roles.Doctor,
        doctor_profile: {
          create: {
            name: name || "Test Doctor",
            phone: "081234567890",
            gender: "Male",
            birthdate: new Date("1990-01-01T00:00:00.000Z"),
            profile_photo: "default-photo.png",
            verification_status: "Verified",
          },
        },
      },
      include: {
        doctor_profile: true,
      },
    });

    this.log.info(`Doctor seeded: ${created.email} (Name: ${created.doctor_profile.name})`);
  }
}

BaseSeeder.run(async function DoctorSeed() {
  const seeder = new DoctorSeeder();
  const [, , argEmail, argPassword, argName] = process.argv;
  
  const email = argEmail;
  const password = argPassword;
  const name = argName;

  if (!email || !password) {
    seeder.log.warn("Usage: npm run seed:doctor <email> <password> [name]");
    process.exit(1);
  }

  await seeder.seed(email, password, name);
});
