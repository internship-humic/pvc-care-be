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
