import "dotenv/config";
import BaseSeeder from "../../common/base_classes/base-seeder.js";
import { hashPassword } from "../auth.util.js";

/**
 * NotificationSeeder
 *
 * Creates two test users (1 Patient + 1 Doctor) with sample notifications
 * so you can immediately test all notification endpoints.
 *
 * Usage:
 *   npm run seed:notification
 *
 * Credentials seeded:
 *   Patient  → patient.notif@test.com  / Test1234!
 *   Doctor   → doctor.notif@test.com   / Test1234!
 */
class NotificationSeeder extends BaseSeeder {
  constructor() {
    super();
  }

  async seed() {
    this.log.info("Starting notification seeder...");

    const patientEmail = "patient.notif@test.com";
    const doctorEmail = "doctor.notif@test.com";
    const password = "Test1234!";
    const hashed = await hashPassword(password);

    // ── 1. Create Patient user ────────────────────────────────────────────────
    let patientUser = await this.db.user.findUnique({ where: { email: patientEmail } });

    if (!patientUser) {
      patientUser = await this.db.user.create({
        data: {
          email: patientEmail,
          password: hashed,
          role: "Patient",
          patient_profile: {
            create: {
              name: "Budi Santoso",
              phone: "081111111111",
              gender: "Male",
              birthdate: new Date("1995-05-15"),
            },
          },
        },
      });
      this.log.info(`Patient created: ${patientUser.email}`);
    } else {
      this.log.warn(`Patient already exists: ${patientEmail}`);
    }

    // ── 2. Create Doctor user ─────────────────────────────────────────────────
    let doctorUser = await this.db.user.findUnique({ where: { email: doctorEmail } });

    if (!doctorUser) {
      doctorUser = await this.db.user.create({
        data: {
          email: doctorEmail,
          password: hashed,
          role: "Doctor",
          doctor_profile: {
            create: {
              name: "Dr. Sarah Williams",
              phone: "082222222222",
              gender: "Female",
              birthdate: new Date("1985-03-20"),
              profile_photo: "/images/default-doctor.png",
              specialization: "Cardiologist",
              verification_status: "Verified",
            },
          },
        },
      });
      this.log.info(`Doctor created: ${doctorUser.email}`);
    } else {
      this.log.warn(`Doctor already exists: ${doctorEmail}`);
    }

    // ── 3. Seed Notifications for Patient ────────────────────────────────────
    const patientNotifications = [
      {
        user_id: patientUser.id,
        type: "VerificationComplete",
        title: "Verifikasi Selesai",
        message: "Dr. Sarah Williams telah memverifikasi hasil analisis PVC Anda.",
        is_read: false,
      },
      {
        user_id: patientUser.id,
        type: "VerificationComplete",
        title: "Verifikasi Selesai",
        message: "Dr. Michael Olise telah memverifikasi hasil analisis PVC Anda.",
        is_read: true,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 hari lalu
      },
      {
        user_id: patientUser.id,
        type: "ReminderCheckup",
        title: "Reminder Pemeriksaan",
        message: "Waktunya untuk melakukan pemeriksaan PVC rutin Anda.",
        is_read: false,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 hari lalu
      },
    ];

    // ── 4. Seed Notifications for Doctor ─────────────────────────────────────
    const doctorNotifications = [
      {
        user_id: doctorUser.id,
        type: "NewScanAssigned",
        title: "Scan PVC Baru Diterima",
        message: "Anda mendapatkan scan PVC baru dari pasien untuk diverifikasi.",
        is_read: false,
      },
      {
        user_id: doctorUser.id,
        type: "DoctorVerified",
        title: "Akun Dokter Diverifikasi",
        message:
          "Selamat! Akun dokter Anda telah diverifikasi. Anda sekarang dapat menerima dan memverifikasi scan PVC pasien.",
        is_read: true,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 hari lalu
      },
    ];

    const allNotifications = [...patientNotifications, ...doctorNotifications];

    for (const notif of allNotifications) {
      await this.db.notification.create({ data: notif });
    }

    this.log.info(
      `Seeded ${patientNotifications.length} notifications for Patient, ` +
        `${doctorNotifications.length} notifications for Doctor.`
    );

    this.log.info("─────────────────────────────────────────────");
    this.log.info("Seeder finished. Test credentials:");
    this.log.info(`  Patient : ${patientEmail} / ${password}`);
    this.log.info(`  Doctor  : ${doctorEmail} / ${password}`);
    this.log.info("─────────────────────────────────────────────");
  }
}

BaseSeeder.run(async function NotificationSeed() {
  const seeder = new NotificationSeeder();
  await seeder.seed();
});
