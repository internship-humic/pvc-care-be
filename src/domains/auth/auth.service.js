import BaseError from "../../common/base_classes/base-error.js";
import Prisma from "../../common/services/prisma.service.js";
import {
  generateToken,
  matchPassword,
  hashPassword,
} from "../../utils/auth.util.js";

class AuthService {
  constructor() {
    this.prisma = Prisma;
  }

  async login(info) {
    const { email, password } = info;

    const user = await this.prisma.farmer.findUnique({
      where: { email },
    });

    if (!user) {
      throw BaseError.notFound("Email not found");
    }

    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      throw BaseError.unauthorized("Invalid password");
    }

    const accessToken = generateToken({ id: user.id, role: "FARMER" }, "1d");

    delete user.password;

    const data = { user, accessToken };

    return data;
  }

  async register(info) {
    const { name, email, password } = info;

    const user = await this.prisma.farmer.findUnique({
      where: { email },
    });

    if (user) {
      throw BaseError.unprocessable("Email already used by another user");
    }

    const newUser = await this.prisma.farmer.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
      },
    });

    delete newUser.password;

    const data = { newUser };

    return data;
  }
}

export default new AuthService();
