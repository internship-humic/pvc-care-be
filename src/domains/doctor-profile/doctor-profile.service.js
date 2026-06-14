import BaseService from "../../common/base_classes/base-service.js";

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

    return updatedDoctor;
  }
}

export default new DoctorProfileService();
