import BaseService from "../../common/base_classes/base-service.js";
import { hashPassword } from "../../utils/auth.util.js";

class ProfileService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getProfile(user_id, role) {
    if (role === "FARMER") {
      const data = await this.db.farmer.findUnique({
        where: { id: user_id }
      });
      
      return data;
    } else if (role === "CUSTOMER") {
      const data = await this.db.customer.findUnique({
        where: { id: user_id }
      });

      return data;
    } else {
      throw this.error.badRequest("Invalid role");
    }
  }

  async updateProfile(info, user_id, role) {
    const ALLOWED = ["name", "email", "password", "address", "phone_number"];
    const data = {};

    for (const key of ALLOWED) {
      if (info[key] !== undefined) {
        if (key === "password") {
          data.password = await hashPassword(info.password);
        } else {
          data[key] = info[key];
        }
      }
    }

    let updated;

    if (Object.keys(data).length > 0) {
      if (role == "FARMER") {
        await this.db.farmer.update({
          where: { id: user_id },
          data: { ...data },
        });

        updated = await this.db.farmer.findFirst({
          where: { id: user_id },
        });

        return updated;
      } else if (role == "CUSTOMER") {
        await this.db.customer.update({
          where: { id: user_id },
          data: { ...data },
        });

        updated = await this.db.customer.findFirst({
          where: { id: user_id },
        });

        return updated;
      }
    } else {
      throw this.error.badRequest("No valid fields to update");
    }
  }
}

export default new ProfileService();
