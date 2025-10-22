import BaseService from "../../common/base_classes/base-service.js";
import { hashPassword } from "../../utils/auth.util.js";

class FarmerProfileService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getFarmerProfile(farmer_id) {
    const data = await this.db.farmer.findUnique({
      where: { id: farmer_id }
    });

    return data;
  }

  async updateFarmerProfile(info, farmer_id) {
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

    if (Object.keys(data).length > 0) {
      await this.db.farmer.update({
        where: { id: farmer_id },
        data: { ...data },
      });
    } else {
      throw this.error.badRequest("No valid fields to update");
    }

    const updated = await this.db.farmer.findFirst({
      where: { id: farmer_id },
    });

    return updated;
  }
}

export default new FarmerProfileService();
