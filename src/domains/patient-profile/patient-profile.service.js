import BaseService from "../../common/base_classes/base-service.js";
import { hashPassword, matchPassword } from "../../utils/auth.util.js";

class PatientProfileService extends BaseService {
  constructor() {
    super();
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
        patient_profile: true,
      },
    });

    if (!user) {
      throw this.error.notFound("User not found");
    }

    if (!user.patient_profile) {
      throw this.error.notFound("Patient profile not found for this user");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      profile: user.patient_profile,
    };
  }

  async updateMyProfile(userId, data) {
    const patientProfile = await this.db.patientProfile.findUnique({
      where: { user_id: userId },
    });

    if (!patientProfile) {
      throw this.error.notFound("Patient profile not found for this user");
    }

    const payload = {};

    if (data.name !== undefined) {
      payload.name = data.name;
    }

    if (data.phone !== undefined) {
      payload.phone = data.phone;
    }

    if (data.gender !== undefined) {
      payload.gender = data.gender;
    }

    if (data.birthdate !== undefined) {
      payload.birthdate = new Date(data.birthdate);
    }

    if (Object.keys(payload).length === 0) {
      throw this.error.badRequest("At least one profile field must be provided.");
    }

    const updatedProfile = await this.db.patientProfile.update({
      where: { id: patientProfile.id },
      data: payload,
    });

    return updatedProfile;
  }

  async updateMyPassword(userId, data) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw this.error.notFound("User not found");
    }

    const isMatch = await matchPassword(data.current_password, user.password);
    if (!isMatch) {
      throw this.error.unauthorized("Current password is incorrect.");
    }

    await this.db.user.update({
      where: { id: userId },
      data: {
        password: await hashPassword(data.new_password),
      },
    });

    return {
      password_updated: true,
    };
  }

  async getAll(query = {}) {
    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit || "100", 10), 1), 100);
    const skip = (page - 1) * limit;

    const patients = await this.db.patientProfile.findMany({
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

    return patients;
  }
}

export default new PatientProfileService();
