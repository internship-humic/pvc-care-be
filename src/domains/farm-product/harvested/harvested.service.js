
import BaseService from "../../common/base_classes/base-service.js";

class HarvestedService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getHarvestedById(id) {
    const data = await this.db.harvested.findUnique({
      where: { id },
    })

    if (!data) {
      throw this.error.notFound("Harvested product not found");
    }

    return data;
  }

  async updateHarvested(id, info) {
    const ALLOWED = ["quantity"];
    const data = {};

    for (const key of ALLOWED) {
      if (info[key] !== undefined) {
        data[key] = info[key];
      }
    }

    if (Object.keys(data).length > 0) {
      await this.db.harvested.update({
        where: { id },
        data: { ...data },
      });
    } else {
      throw this.error.badRequest("No valid fields to update");
    }

    const updated = await this.db.harvested.findUnique({
      where: { id },
    });

    return updated;
  }
}

export default new HarvestedService();
