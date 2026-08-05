import BaseService from "../../common/base_classes/base-service.js";
import NotificationService from "../notification/notification.service.js";

class DoctorProfileService extends BaseService {
  constructor() {
    super();
  }

  async getById(id) {
    const doctorProfile = await this.db.doctorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!doctorProfile) {
      throw this.error.notFound("Doctor profile not found");
    }

    return doctorProfile;
  }

  async getMyProfile(userId) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        doctor_profile: true,
      },
    });

    if (!user) {
      throw this.error.notFound("User not found");
    }

    if (!user.doctor_profile) {
      throw this.error.notFound("Doctor profile not found for this user");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      profile: user.doctor_profile,
    };
  }

  async updateMyProfile(userId, data, profilePhoto) {
    const doctorProfile = await this.db.doctorProfile.findUnique({
      where: { user_id: userId },
    });

    if (!doctorProfile) {
      throw this.error.notFound("Doctor profile not found for this user");
    }

    const payload = {};

    if (data.name !== undefined) payload.name = data.name;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.gender !== undefined) payload.gender = data.gender;
    if (data.birthdate !== undefined) payload.birthdate = new Date(data.birthdate);
    if (profilePhoto) payload.profile_photo = `/images/${profilePhoto.filename}`;

    if (Object.keys(payload).length === 0) {
      throw this.error.badRequest("At least one profile field must be provided.");
    }

    const updatedProfile = await this.db.doctorProfile.update({
      where: { id: doctorProfile.id },
      data: payload,
    });

    return updatedProfile;
  }

  async getMyPatients(userId, query = {}) {
    const doctorProfile = await this.db.doctorProfile.findUnique({
      where: { user_id: userId },
    });

    if (!doctorProfile) {
      throw this.error.notFound("Doctor profile not found for this user");
    }

    if (doctorProfile.verification_status !== "Verified") {
      throw this.error.forbidden("Only verified doctors can access the patient list");
    }

    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;
    const search = query.search?.trim() || null;

    // Fetch all scans assigned to this doctor with patient info
    const scans = await this.db.pvcScan.findMany({
      where: { doctor_profile_id: doctorProfile.id },
      orderBy: { created_at: "desc" },
      include: {
        patient: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
      },
    });

    // Group scans by patient_profile_id to build per-patient summary
    const patientMap = new Map();
    for (const scan of scans) {
      const pid = scan.patient_profile_id;
      if (!patientMap.has(pid)) {
        patientMap.set(pid, {
          patient: scan.patient,
          last_visit: scan.created_at,
          total_scans: 0,
          latest_status: scan.verification_status,
        });
      }
      const entry = patientMap.get(pid);
      entry.total_scans += 1;
      // Track most recent visit
      if (scan.created_at > entry.last_visit) {
        entry.last_visit = scan.created_at;
        entry.latest_status = scan.verification_status;
      }
    }

    // Convert to array and apply optional search filter
    let patients = Array.from(patientMap.values());

    if (search) {
      const lower = search.toLowerCase();
      patients = patients.filter(
        (p) =>
          p.patient?.name?.toLowerCase().includes(lower) ||
          p.patient?.user?.email?.toLowerCase().includes(lower)
      );
    }

    const total = patients.length;
    const paginated = patients.slice(skip, skip + limit);

    return {
      data: paginated.map((p) => ({
        id: p.patient?.id,
        name: p.patient?.name,
        phone: p.patient?.phone,
        gender: p.patient?.gender,
        birthdate: p.patient?.birthdate,
        email: p.patient?.user?.email,
        last_visit: p.last_visit,
        total_scans: p.total_scans,
        latest_status: p.latest_status,
      })),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async verifyDoctor(id, verificationStatus) {
    const doctorProfile = await this.db.doctorProfile.findUnique({
      where: { id },
    });

    if (!doctorProfile) {
      throw this.error.notFound("Doctor profile not found");
    }

    const updatedDoctor = await this.db.doctorProfile.update({
      where: { id },
      data: {
        verification_status: verificationStatus,
      },
    });

    // Kirim notifikasi ke dokter terkait perubahan status verifikasi
    try {
      const isVerified = verificationStatus === "Verified";
      await NotificationService.createNotification({
        userId: doctorProfile.user_id,
        type: isVerified ? "DoctorVerified" : "DoctorDeclined",
        title: isVerified ? "Akun Dokter Diverifikasi" : "Verifikasi Akun Ditolak",
        message: isVerified
          ? "Selamat! Akun dokter Anda telah diverifikasi. Anda sekarang dapat menerima dan memverifikasi scan PVC pasien."
          : "Maaf, verifikasi akun dokter Anda ditolak. Silakan hubungi administrator untuk informasi lebih lanjut.",
      });
    } catch (notifError) {
      console.error("Failed to create notification for doctor verification:", notifError.message);
    }

    return updatedDoctor;
  }

  async getAll(query = {}) {
    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit || "100", 10), 1), 100);
    const skip = (page - 1) * limit;

    const doctors = await this.db.doctorProfile.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return doctors;
  }

  async getPublicDoctors() {
    const doctors = await this.db.doctorProfile.findMany({
      where: {
        verification_status: "Verified",
      },
      orderBy: { name: "asc" },
    });

    return doctors;
  }
}

export default new DoctorProfileService();
