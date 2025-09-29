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

    const user = await this.db.farmer.findUnique({
      where: { email },
    });

    if (!user) {
      throw this.error.notFound("Email not found");
    }

    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      throw this.error.unauthorized("Invalid password");
    }

    const accessToken = generateToken({ id: user.id, role: Roles.Farmer });

    delete user.password;

    const data = { user, accessToken };

    return data;
  }

  async register(info) {
    const { name, email, password } = info;

    const user = await this.db.farmer.findUnique({
      where: { email },
    });

    if (user) {
      throw this.error.unprocessable("Email already used by another user");
    }

    const newUser = await this.db.farmer.create({
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
