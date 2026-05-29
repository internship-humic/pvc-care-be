import BaseService from "../../common/base_classes/base-service.js";
import {
  generateToken,
  matchPassword,
  hashPassword,
} from "../../utils/auth.util.js";
import Roles from "../../common/enums/user-roles.enum.js";

class AuthService extends BaseService {
  constructor() {
    super();
  }
  
  async login(info) {
    const { email, password } = info;

    const user = await this.db.user.findUnique({
      where: { email },
      include: {
        patient_profile: true,
        doctor_profile: true,
      }
    });

    if (!user) {
      throw this.error.notFound("Email not found");
    }

    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      throw this.error.unauthorized("Invalid password");
    }

    const accessToken = generateToken({ id: user.id, role: user.role });

    delete user.password;

    const data = { user, accessToken };

    return data;
  }

  async registerPatient(info) {
    const { email, password, profile } = info;

    const existingUser = await this.db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw this.error.unprocessable("Email already used by another user");
    }

    const userData = {
      email,
      password: await hashPassword(password),
      role: Roles.Patient,
      patient_profile: {
        create: {
          name: profile.name,
          phone: profile.phone,
          gender: profile.gender,
          birthdate: new Date(profile.birthdate),
        }
      }
    };

    const newUser = await this.db.user.create({
      data: userData,
      include: {
        patient_profile: true,
      }
    });

    delete newUser.password;

    return { user: newUser };
  }

  async registerDoctor(info) {
    const { email, password, profile } = info;

    const existingUser = await this.db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw this.error.unprocessable("Email already used by another user");
    }

    const userData = {
      email,
      password: await hashPassword(password),
      role: Roles.Doctor,
      doctor_profile: {
        create: {
          name: profile.name,
          phone: profile.phone,
          gender: profile.gender,
          birthdate: new Date(profile.birthdate),
          profile_photo: profile.profile_photo,
        }
      }
    };

    const newUser = await this.db.user.create({
      data: userData,
      include: {
        doctor_profile: true,
      }
    });

    delete newUser.password;

    return { user: newUser };
  }
}

export default new AuthService();
